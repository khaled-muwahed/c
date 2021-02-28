# cooffidaProject
# Coffida App

Coffida App is a mobile application developed using React Native framework and written in JavaScript

## Description
CoffiDa is platform for reviewing the best local coffee spots. Anybody can use CoffiDa for finding the
best local Café’s, but Users who sign up for an account can also publish reviews. Reviews consist of a
series of ratings (e.g. quality, price, cleanliness) along with a short body of text for describing their
experience. Users can also comment on, and ‘like’ other reviews


## Installation

I will list the required steps to run the applications but first you would need to have the Android Studio development framework installed on your machine, Click [here](https://developer.android.com/studio?gclid=CjwKCAiA1eKBBhBZEiwAX3gql6WzXB-DD7GJYW1h2SNNXFvYikXHxyf0_7z4DMIlTlomShlV_CClmBoCWCcQAvD_BwE&gclsrc=aw.ds) to redirect you to the instructions of how to install it. Then you have to install React Native CLl on your machine. The instructions for installation are located [here](https://reactnative.dev/docs/getting-started).

Now open the Android studio and click on file then open from the top left android studio screen then navigator to the project folder and select android. "./TestProject/android". You will need to create a new AVD if you don't have one already. Click "Tools" > "AVD Manager" following the steps. Once it's created run the emulator by clicking the green triangle button on top.

Now you should add the following lines to the Manifests in order to allow access to the internet, camera and location :
```bash
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />

```

Now click on the build.gradle(Module:app), onto the defaultConfig compare and add the missing ones from following lines:
```bash
defaultConfig {
  applicationId "com.myproject"
        minSdkVersion rootProject.ext.minSdkVersion
        missingDimensionStrategy 'react-native-camera', 'general'
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
}
```
Make sure now to Sync project with new changes from file on the top corner of android studio screen.

The next step, open your terminal and navigate to the project directory. Then run this command to install all the modules and packages used within the project :

```bash
npm install
```
Re-insert this command to enure all the modules are installed properly :
```bash
npm install
```
Then run this command to open up the application :
```bash
npx react-native run-android
```
Now you are all set the and application should open on your AVD 

## Support
If you have any issues with the project and want to get help, or even having an idea to enhance/add something I am always happy to hear from you via emails on : muwahedkhaled@gmail.com .

## Roadmap
I am planning on improving the responsiveness of the map and make it quicker in the future. 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change in the application. Please feel free to email me in regards any contribution you would like to add using my email address above in support section. Follow this [link](https://github.com/khaled-muwahed/cooffidaProject) to do\wnload the repository on GitHub. 

Also you can download a zipped copy of the app using this oneDrive link [link](https://stummuac-my.sharepoint.com/personal/17001788_stu_mmu_ac_uk/_layouts/15/onedrive.aspx?id=%2Fpersonal%2F17001788%5Fstu%5Fmmu%5Fac%5Fuk%2FDocuments%2FMuwahedkhaled%5F17001788%2Ezip&parent=%2Fpersonal%2F17001788%5Fstu%5Fmmu%5Fac%5Fuk%2FDocuments&originalPath=aHR0cHM6Ly9zdHVtbXVhYy1teS5zaGFyZXBvaW50LmNvbS86dTovZy9wZXJzb25hbC8xNzAwMTc4OF9zdHVfbW11X2FjX3VrL0VhOVJWZE9SelJ0SHNLdVhPSGh0QVI0QnRrUzktTG5OYjFGMzZfVmxiY0tKX1E_cnRpbWU9VkNRVFpaYmEyRWc)
