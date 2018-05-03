#ifndef WINVER
#define WINVER 0x0603
#endif

#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0603
#endif

#define UNICODE

#include <string>
#include <node.h>
#include <nan.h>

#include <CommCtrl.h>
#include <commoncontrols.h>
#include <Windows.h>
#include <mutex>

using std::min;
using std::max;

#include <gdiplus.h>

#pragma comment(lib, "gdiplus.lib")

using std::string;
using std::wstring;
using namespace Gdiplus;

using v8::Local;
using v8::Value;
using v8::Object;
using v8::Function;
using v8::Number;
using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::HandleScope;
using Nan::New;
using Nan::Null;

static CLSID encoderClsid;
int GetEncoderClsid(const WCHAR* format, CLSID* pClsid) {
	UINT num = 0;
	UINT size = 0;
	ImageCodecInfo* pImageCodecInfo = NULL;

	GetImageEncodersSize(&num, &size);
	if (size == 0)
		return -1;

	pImageCodecInfo = (ImageCodecInfo*)(malloc(size));
	if (pImageCodecInfo == NULL)
		return -1;

	GetImageEncoders(num, size, pImageCodecInfo);

	for (UINT j = 0; j < num; ++j) {
		if (wcscmp(pImageCodecInfo[j].MimeType, format) == 0) {
			*pClsid = pImageCodecInfo[j].Clsid;
			free(pImageCodecInfo);
			return j;
		}
	}

	free(pImageCodecInfo);
	return -1;
}

std::mutex mtx;

int _FetchFileIconToPng(wstring &path, unsigned int *ret_len, char **buf) {
	SHFILEINFO fi = { 0 };
  mtx.lock();
	auto hr = SHGetFileInfo(path.c_str(), 0, &fi, sizeof(fi), SHGFI_SYSICONINDEX);
  mtx.unlock();
  
	if (hr == 0) {
		return -1;
	}

	IImageList *piml;
	if (FAILED(SHGetImageList(SHIL_LARGE, IID_PPV_ARGS(&piml)))) {
		return -2;
  }

	HICON hIcon;
	piml->GetIcon(fi.iIcon, ILD_TRANSPARENT, &hIcon);
	piml->Release();

	// icon
	ICONINFO iconInfo = { 0 };
	GetIconInfo(hIcon, &iconInfo);

	HDC dc = GetDC(NULL);
	BITMAP bm = { 0 };
	GetObject(iconInfo.hbmColor, sizeof(BITMAP), &bm);

	BITMAPINFO bmi = { 0 };
	bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	bmi.bmiHeader.biWidth = bm.bmWidth;
	bmi.bmiHeader.biHeight = -bm.bmHeight;
	bmi.bmiHeader.biPlanes = 1;
	bmi.bmiHeader.biBitCount = 32;
	bmi.bmiHeader.biCompression = BI_RGB;

	// extract
	int nBits = bm.bmWidth * bm.bmHeight;
	int32_t* colorBits = new int32_t[nBits];
	GetDIBits(dc, iconInfo.hbmColor, 0, bm.bmHeight, colorBits, &bmi, DIB_RGB_COLORS);

	ReleaseDC(NULL, dc);
	::DeleteObject(iconInfo.hbmColor);
	::DeleteObject(iconInfo.hbmMask);

	Gdiplus::Bitmap *bmp = new Gdiplus::Bitmap(bm.bmWidth, bm.bmHeight, bm.bmWidth * 4, PixelFormat32bppARGB, (BYTE*)colorBits);
	DestroyIcon(hIcon);

	IStream *pStream = NULL;
	if (CreateStreamOnHGlobal(NULL, true, (LPSTREAM*)&pStream) != S_OK) {
		delete bmp;
		delete[] colorBits;
		return -3;
	}

	if (bmp->Save(pStream, &encoderClsid, NULL) != Ok) {
		pStream->Release();
		delete bmp;
		delete[] colorBits;
		return -4;
	}

	delete bmp;
	delete[] colorBits;

	ULARGE_INTEGER length;
	LARGE_INTEGER offset;
	offset.QuadPart = 0;
	if (pStream->Seek(offset, STREAM_SEEK_END, &length) != S_OK) {
		pStream->Release();
		return -5;
	}

	if (pStream->Seek(offset, STREAM_SEEK_SET, NULL) != S_OK) {
		pStream->Release();
		return -6;
	}

	char *pBuf = new char[(unsigned int)length.QuadPart];
	ULONG ulBytesRead;
	if (pStream->Read(pBuf, (ULONG)length.QuadPart, &ulBytesRead) != S_OK) {
		pStream->Release();
		delete[] pBuf;
		return -7;
	}

	*ret_len = (unsigned int)length.QuadPart;
	pStream->Release();

  *buf = pBuf;
  return 0;
}

wstring Utf8ToUtf16(const string &s) {
	wstring ret;
	int len = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.length(), NULL, 0);
	if (len > 0) {
		ret.resize(len);
		MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.length(), const_cast<wchar_t*>(ret.c_str()), len);
	}
	return ret;
}

class FileIconWorker : public AsyncWorker {
public:
	FileIconWorker(Callback *callback, wstring filePath) : AsyncWorker(callback), filePath(filePath), 
                                                         ret(0), buf(NULL), buf_len(0) {}

	void Execute() {
    CoInitialize(NULL);
		ret = _FetchFileIconToPng(filePath, &buf_len, &buf);
    CoUninitialize();
	}

	void HandleOKCallback() {
		HandleScope scope;
    
    if (ret != 0) {
      // error
      Local<Value> argv[] = {
        New<Number>(ret),
        Null()
      };
      callback->Call(2, argv);
    } else {
      // okay
      Local<Value> argv[] = {
        Null(),
        Nan::NewBuffer(buf, buf_len).ToLocalChecked()
      };
      callback->Call(2, argv);
    }
	}

private:
	wstring filePath;
  int ret;
	char *buf;
	unsigned int buf_len;
};

NAN_METHOD(FetchFileIconAsPng) {
	if (info.Length() != 2) {
		return Nan::ThrowError("invalid number of agruments");
	}

	if (!info[0]->IsString()) {
		return Nan::ThrowTypeError("an argument should be a String");
	}

	v8::String::Utf8Value param1(info[0]->ToString());
	wstring path_wstr(Utf8ToUtf16(*param1));

	Callback *callback = new Callback(info[1].As<Function>());
	AsyncQueueWorker(new FileIconWorker(callback, path_wstr));
}

ULONG_PTR gdiplusToken = NULL;
void Startup() {
	GdiplusStartupInput gdiplusStartupInput;

	if (GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, NULL) != Ok) {
		Nan::ThrowError("GdiplusStartup failed");
		return;
	}

	GetEncoderClsid(L"image/png", &encoderClsid);
}

void Shutdown(void*) {
	if (gdiplusToken == NULL)
		return;
  
	GdiplusShutdown(gdiplusToken);
}

HWND prevFocusedWindow_ = NULL;
NAN_METHOD(SaveFocus) {
	prevFocusedWindow_ = GetForegroundWindow();
}

NAN_METHOD(RestoreFocus) {
	if (prevFocusedWindow_ == NULL)
		return;
	SetForegroundWindow(prevFocusedWindow_);
	prevFocusedWindow_ = NULL;
}

void Init(Local<Object> exports) {
	Startup();

	exports->Set(New("fetchFileIconAsPng").ToLocalChecked(),
		New<v8::FunctionTemplate>(FetchFileIconAsPng)->GetFunction());
	exports->Set(New("saveFocus").ToLocalChecked(),
		New<v8::FunctionTemplate>(SaveFocus)->GetFunction());
	exports->Set(New("restoreFocus").ToLocalChecked(),
		New<v8::FunctionTemplate>(RestoreFocus)->GetFunction());

	node::AtExit(Shutdown);
}

NODE_MODULE(addon, Init)
