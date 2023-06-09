// #import "AppDelegate.h"

// #import <React/RCTBridge.h>
// #import <React/RCTBundleURLProvider.h>
// #import <React/RCTRootView.h>
// #import <React/RCTLinkingManager.h>
// #import <React/RCTConvert.h>

// #import <React/RCTAppSetupUtils.h>

// #import <Firebase.h>

// #if RCT_NEW_ARCH_ENABLED
// #import <React/CoreModulesPlugins.h>
// #import <React/RCTCxxBridgeDelegate.h>
// #import <React/RCTFabricSurfaceHostingProxyRootView.h>
// #import <React/RCTSurfacePresenter.h>
// #import <React/RCTSurfacePresenterBridgeAdapter.h>
// #import <ReactCommon/RCTTurboModuleManager.h>
// #import <react/config/ReactNativeConfig.h>

// @interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
//   RCTTurboModuleManager *_turboModuleManager;
//   RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
//   std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
//   facebook::react::ContextContainer::Shared _contextContainer;
// }
// @end
// #endif

// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   RCTAppSetupPrepareApp(application, true);

//   if ([FIRApp defaultApp] == nil) {
//     [FIRApp configure];
//   }
  
//   RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];


// #if RCT_NEW_ARCH_ENABLED
//   _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
//   _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
//   _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
//   _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
//   bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
// #endif

//   UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"main", nil, true);

//   if (@available(iOS 13.0, *)) {
//     rootView.backgroundColor = [UIColor systemBackgroundColor];
//   } else {
//     rootView.backgroundColor = [UIColor whiteColor];
//   }

//   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//   UIViewController *rootViewController = [UIViewController new];
//   rootViewController.view = rootView;
//   self.window.rootViewController = rootViewController;
//   [self.window makeKeyAndVisible];
//   return YES;
// }

// - (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
// {
//   // If you'd like to export some custom RCTBridgeModules that are not Expo modules, add them here!
//   return @[];
// }

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

// // Linking API
// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//   return [RCTLinkingManager application:application openURL:url options:options];
// }

// // Universal Links
// - (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
//  return [RCTLinkingManager application:application
//                   continueUserActivity:userActivity
//                     restorationHandler:restorationHandler];
// }

// #if RCT_NEW_ARCH_ENABLED

// #pragma mark - RCTCxxBridgeDelegate

// - (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
// {
//   _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
//                                                              delegate:self
//                                                             jsInvoker:bridge.jsCallInvoker];
//   return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
// }

// #pragma mark RCTTurboModuleManagerDelegate

// - (Class)getModuleClassFromName:(const char *)name
// {
//   return RCTCoreModulesClassProvider(name);
// }

// - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
//                                                       jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
// {
//   return nullptr;
// }

// - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
//                                                      initParams:
//                                                          (const facebook::react::ObjCTurboModule::InitParams &)params
// {
//   return nullptr;
// }

// - (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
// {
//   return RCTAppSetupDefaultModuleFromClass(moduleClass);
// }

// #endif

// @end
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"RnDiffApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
