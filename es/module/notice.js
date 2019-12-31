import electron from "electron"

/**
 * titleString - 通知的标题, 将在通知窗口的顶部显示.
 * subtitleString (可选) 通知的副标题, 显示在标题下面。 macOS
 * bodyString 通知的正文文本, 将显示在标题或副标题下面.
 * silentBoolean (可选) 在显示通知时是否发出系统提示音。
 * icon(String | NativeImage ) (可选) 用于在该通知上显示的图标。
 * hasReplyBoolean (可选) 是否在通知中添加一个答复选项。 macOS
 * replyPlaceholderString (可选) 答复输入框中的占位符。 macOS
 * soundString (可选) 显示通知时播放的声音文件的名称。 macOS
 * actions NotificationAction[] (可选) macOS - 要添加到通知中的操作 请阅读 NotificationAction文档来了解可用的操作和限制。
 * closeButtonText String (可选) macOS - 自定义的警告框关闭按钮文字。如果该字符串为空，那么将使用本地化的默认文本。
 * @param option
 * @returns {Electron.Notification}
 */
export const notice = (option) => {
  let notice = new electron.Notification(option)
  notice.show()
  return notice
}
