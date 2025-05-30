#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <React/RCTLinkingManager.h>  // For Auth0 authentication

#import "RNSplashScreen.h"  // here

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Rescheduler";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  //  return [super application:application didFinishLaunchingWithOptions:launchOptions];
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

  [RNSplashScreen show];  // 👈 Correct place after React Native is initialized

  return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// For Auth0 authentication

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options

{
return [RCTLinkingManager application:app openURL:url options:options];
}

@end
