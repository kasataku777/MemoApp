import React ,{useState}from 'react';
import {View,StyleSheet, TextInput,Alert} from 'react-native';
import {shape,string} from 'prop-types';

import CircleButton from '../components/CircleButton';
import KeyboardSafeView from '../components/KeyboardSafeView';
import firebase from 'firebase';
import {translateErrors} from '../utils';

export default function MemoEditScreen (props){
   const {navigation,route}=props;
   const {id,bodyText}= route.params;
   const [body,setBody]=useState(bodyText);


   function handlePress(){
     const {currentUser} = firebase.auth();
     if(currentUser){
       const db = firebase.firestore();
       const ref = db.collection(`users/${currentUser.uid}/memos`).doc(id);
       ref.set({
         bodyText:body,
         updatedAt:new Date(),
       },{merge:true}).then(()=>{
         navigation.goBack();
       })
       .catch(
         (error)=>{
           const errorMsg = translateErrors(error.code);
           Alert.alert(error.code);
         }
       );
     }
   }
    return (
        <KeyboardSafeView style={styles.container} >

          <View style={styles.inputContainer}>
            <TextInput value={body} multiline
            style={styles.input}
            onChangeText={(text)=>{setBody(text);}}/>
          </View>
          <CircleButton
          name="check"
          onPress={handlePress}/>
        </KeyboardSafeView>
    );
}

MemoEditScreen.propTypes={route:shape({
  params: shape({id:string,bodyText:string}),
}).isRequired,
};

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    inputContainer:{
      paddingHorizontal:27,
      paddingVertical:32,
      flex:1
    },
    input:{
      flex:1,
      textAlignVertical:'top',
      fontSize:16,
      lineHeight:24,
    }
});
