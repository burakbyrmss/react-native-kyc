require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'ReactNativeKyc'
  s.version = package.fetch('version')
  s.summary = package.fetch('description')
  s.homepage = package.fetch('homepage')
  s.author = 'React Native KYC contributors'
  s.license = { :type => package.fetch('license') }
  s.source = { :git => "#{s.homepage}.git", :tag => "v#{s.version}" }
  s.platforms = { :ios => min_ios_version_supported }
  s.swift_version = '5.0'
  s.source_files = 'ios/**/*.{h,mm,swift}'
  s.frameworks = 'AVFoundation'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  install_modules_dependencies(s)
end
