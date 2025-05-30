package com.rescheduler

import android.os.Bundle // Import required for onCreate
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

// import org.devio.rn.splashscreen.SplashScreen; // here

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Rescheduler"

  /**
  * Sets the theme back to AppTheme after the splash screen.
  */
    override fun onCreate(savedInstanceState: Bundle?) {
        // SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState)
        setTheme(R.style.AppTheme) // Change to your AppTheme
    }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
