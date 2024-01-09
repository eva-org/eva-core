#include <node.h>
#include <nan.h>
#include "BundleUtils.h"

using v8::Local;
using v8::Value;
using v8::Object;
using v8::Function;
using v8::String;
using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::HandleScope;
using Nan::New;
using Nan::Null;

class AppIconWorker : public AsyncWorker {
public:
	AppIconWorker(Callback *callback, std::string bundlePath, std::string pngPath)
   : AsyncWorker(callback), bundlePath(bundlePath), pngPath(pngPath), success(false) {}

	void Execute() {
    @autoreleasepool {
      NSString *s_bundlePath = [NSString stringWithUTF8String:bundlePath.c_str()];
      NSString *s_pngPath = [NSString stringWithUTF8String:pngPath.c_str()];
      
      success = [BundleUtils saveApplicationIconAsPngWithPath: s_bundlePath pngPath: s_pngPath];
    }
	}

	void HandleOKCallback() {
		HandleScope scope;
    
    Local<Value> argv[] = { Nan::New(success) };
    callback->Call(1, argv);
	}

private:
	std::string bundlePath;
  std::string pngPath;
  bool success;
};

NAN_METHOD(getLocalizedBundleDisplayName) {
	v8::String::Utf8Value param1(info[0]->ToString());

  @autoreleasepool {
    NSString *bundlePath = [NSString stringWithUTF8String:*param1];
    NSString *bundleName = [BundleUtils getLocalizedBundleDisplayNameWithPath: bundlePath];
    if (bundleName)
      info.GetReturnValue().Set(Nan::New([bundleName UTF8String]).ToLocalChecked());
  }
}

NAN_METHOD(saveApplicationIconAsPng) {
	v8::String::Utf8Value param1(info[0]->ToString());
	v8::String::Utf8Value param2(info[1]->ToString());
  Callback *callback = new Callback(info[2].As<Function>());
  std::string bundlePath(*param1);
  std::string pngPath(*param2);

  AsyncQueueWorker(new AppIconWorker(callback, bundlePath, pngPath));
}

void Init(Local<Object> exports) {
  exports->Set(New("getLocalizedBundleDisplayName").ToLocalChecked(),
    New<v8::FunctionTemplate>(getLocalizedBundleDisplayName)->GetFunction());
  exports->Set(New("saveApplicationIconAsPng").ToLocalChecked(),
    New<v8::FunctionTemplate>(saveApplicationIconAsPng)->GetFunction());
}

NODE_MODULE(mac_bundle_util, Init)
