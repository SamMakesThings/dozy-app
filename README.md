# dozy-app

Dozy: App to automate Cognitive Behavioral Therapy for Insomnia. Ditch the daytime brain fog with drug-free insomnia care.

## Setup instructions

1. Clone the repo
2. Run `yarn` in the repo directory
3. Ensure your development environment is set up correctly (probably involves setting up TypeScript)
4. Run the metro server with `npx react-native start`
5. Run the app on your desired emulator with `npx react-native run-ios` (or `run-android`)

### Build app

1. Install EAS CLI by running `yarn global add eas-cli`. Always make sure to use the latest EAS CLI.
2. Login with an EAS account with `eas login`. You can check whether you're logged in by running `eas whoami`.
3. Install gem packages with `cd android && bundle install` for Android, `cd ios && bundle install` for iOS.
4. Commit all changes before building
5. Alpha build
   - Add an ad-hoc provisioning profile to ios/ directory as `ad_hoc_provision.mobileprovision`.
   - Add a distribution certificate to ios/ directory as `distribution_certificate.p12`.
   - Update `build.alpha.releaseChannel` in eas.json if needed.
   - Build by running `yarn run build-alpha`.
6. Beta build
   - Update `build.release.releaseChannel` in eas.json if needed.
   - Build by running `yarn run build-prod`.
7. If there is an update of fastlane version, upgrade it by running `bundle update fastlane` in android/ and ios/ directories and commit thoese changes.
