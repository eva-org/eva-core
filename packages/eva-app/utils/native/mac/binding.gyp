{
  "targets": [
    {
      "target_name": "mac-bundle-util",
      "sources": [
        "mac_bundle_util.mm",
        "BundleUtils.m"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "xcode_settings": {
        "OTHER_CPLUSPLUSFLAGS": [
          "-std=c++11",
          "-stdlib=libc++",
          "-mmacosx-version-min=10.8"
        ],
        "OTHER_LDFLAGS": [
          "-framework CoreFoundation -framework IOKit -framework AppKit"
        ]
      }
    }
  ]
}
