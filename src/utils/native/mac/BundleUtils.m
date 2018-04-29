#import <AppKit/AppKit.h>
#import "BundleUtils.h"

@implementation BundleUtils

+ (NSString *)getLocalizedBundleDisplayNameWithPath:(NSString *)bundlePath {
    NSBundle *bundle = [NSBundle bundleWithPath:bundlePath];
    if (bundle == nil)
        return nil;

    for (NSString *lang in [NSBundle preferredLocalizationsFromArray:[bundle localizations] forPreferences:[NSLocale preferredLanguages]]) {
        NSString *resBundlePath = [bundle pathForResource:lang ofType:@"lproj"];
        NSBundle *resourceBundle = [NSBundle bundleWithPath:resBundlePath];
        if (resourceBundle == nil)
            continue;

        NSString *localizedBundleDisplayName = [resourceBundle localizedStringForKey:@"CFBundleDisplayName" value:nil table:@"InfoPlist"];
        if (![localizedBundleDisplayName isEqualToString:@"CFBundleDisplayName"])
            return localizedBundleDisplayName;
        
        NSString *localizedBundleName = [resourceBundle localizedStringForKey:@"CFBundleName" value:nil table:@"InfoPlist"];
        if (![localizedBundleName isEqualToString:@"CFBundleName"])
            return localizedBundleName;
    }

    NSDictionary *localizedInfo = [bundle localizedInfoDictionary];
    if (localizedInfo) {
        NSString *bundleName = [self _getBundleNameFromInfoDictionary:localizedInfo];
        if (bundleName)
            return bundleName;
    }
    
    NSDictionary *info = [bundle infoDictionary];
    if (info) {
        NSString *bundleName = [self _getBundleNameFromInfoDictionary:info];
        if (bundleName)
            return bundleName;
    }
    return nil;
}

+ (NSString *)_getBundleNameFromInfoDictionary:(NSDictionary *)info {
    NSString *bundleDisplayName = [info objectForKey:@"CFBundleDisplayName"];
    if (bundleDisplayName)
        return bundleDisplayName;

    NSString *bundleName = [info objectForKey:@"CFBundleName"];
    return bundleName;
}

+ (BOOL)saveApplicationIconAsPngWithPath:(NSString *)bundlePath pngPath:(NSString *)pngPath {
    NSBundle *bundle = [NSBundle bundleWithPath:bundlePath];
    if (bundle == nil)
        return NO;
    
    NSString *iconFilename = [bundle objectForInfoDictionaryKey:@"CFBundleIconFile"];
    if (iconFilename == nil)
        return NO;
    
    NSString *iconBasename = [iconFilename stringByDeletingPathExtension];
    NSString *iconExtension = [iconFilename pathExtension];
    if (iconExtension == nil || [iconExtension length] <= 0)
        iconExtension = @"icns";
    
    NSString *iconPath = [bundle pathForResource:iconBasename ofType:iconExtension];
    if (iconPath == nil || [iconPath length] <= 0)
        return NO;
    
    NSImage *iconImage = [[NSImage alloc] initWithContentsOfFile:iconPath];
    CGImageRef cgRef = [iconImage CGImageForProposedRect:nil context:nil hints:nil];
    NSBitmapImageRep *bitmapRep = [[NSBitmapImageRep alloc] initWithCGImage:cgRef];
    [bitmapRep setSize:[iconImage size]];
    NSData *pngData = [bitmapRep representationUsingType:NSPNGFileType properties:@{}];
    [pngData writeToFile:pngPath atomically:YES];
    
    return YES;
}

@end
