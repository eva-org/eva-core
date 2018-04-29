#import <Foundation/Foundation.h>

@interface BundleUtils : NSObject

+ (NSString*)getLocalizedBundleDisplayNameWithPath: (NSString *)bundlePath;
+ (NSString*)_getBundleNameFromInfoDictionary: (NSDictionary *)info;

+ (BOOL)saveApplicationIconAsPngWithPath: (NSString *)bundlePath pngPath:(NSString *)pngPath;

@end
