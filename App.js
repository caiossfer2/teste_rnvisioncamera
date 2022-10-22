import React, { useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera, useCameraDevices,  } from 'react-native-vision-camera';
import { useRef } from 'react';


export default function App() {

  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = React.useState(false);
  const camera = useRef(null)
  const [showImage, setShowImage] = React.useState(false);
  const [photoUri, setPhotoUri] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.getCameraPermissionStatus();
      await Camera.requestCameraPermission();
      if(status == 'authorized'){
        setHasPermission(true);
      }
      console.log(status)
    })();
  }, []);

  const takePhoto = async () => {
    try {
      if (camera.current == null) throw new Error('Camera Ref is Null');
      console.log('Photo taking ....');
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        'enableAutoStabilization' : 'true',
        'enableAutoDistortionCorrection' : 'true'
      });
      console.log(photo.path);
      setShowImage(true);
      let path = 'file://' + photo.path;
      setPhotoUri(path);
    } catch (error) {
      console.log(error);
    }
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (device == null) return <View><Text>Sem device</Text></View>
  return (
    <View style={{width: '100%',height: '100%',}}>
    {
      showImage ? 
      <>
      <Image source={{uri:photoUri}} style={{width: '100%',height: '96%',}} /> 
      <Button title='Voltar' onPress={()=> setShowImage(false)} />
      </>
    :
        <>

        <Camera
          style={styles.cameraStyle}
          device={device}
          isActive={true}
          photo={true}
          ref={camera}
          zoom={1.5}
          />
          <Button title='tirar foto' onPress={()=> takePhoto()} />
        </>
    }
    </View>
  );

}

const styles = StyleSheet.create({
  cameraStyle: {
    // width: '100%',
    // height: '100%',
    //  position: 'absolute',
    // zIndex: 0,
    // flex: 1,
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  takePhotoButton:{
    // position: 'absolute',
    // bottom: 20,
    // width: 30,
    // height: 30,
    // color: 'green',
    // borderRadius: 15,
    // zIndex: 2
  }
});
