import AVFoundation
import Foundation

@objc(RNKycFaceCamera)
public final class KycFaceCamera: NSObject {
    @objc public static func isFrontCameraAvailable() -> Bool {
        AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) != nil
    }
}
