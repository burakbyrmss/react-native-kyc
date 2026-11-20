package com.reactnativekyc

import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

internal class KycFaceModule(context: ReactApplicationContext) : NativeKycFaceSpec(context) {
    private val packageManager = context.packageManager

    override fun getName(): String = NAME

    override fun isFrontCameraAvailable(promise: Promise) {
        promise.resolve(packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FRONT))
    }

    companion object {
        const val NAME = "NativeKycFace"
    }
}
