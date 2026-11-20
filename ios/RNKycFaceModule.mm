#import <RNKycSpec/RNKycSpec.h>
#import "ReactNativeKyc-Swift.h"

@interface RNKycFaceModule : NSObject <NativeKycFaceSpec>
@end

@implementation RNKycFaceModule

+ (NSString *)moduleName
{
  return @"NativeKycFace";
}

- (void)isFrontCameraAvailable:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
  resolve(@([RNKycFaceCamera isFrontCameraAvailable]));
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeKycFaceSpecJSI>(params);
}

@end
