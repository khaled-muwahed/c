import {
    
    StyleSheet
  } from 'react-native';


const styles = StyleSheet.create({
    title: {
      color: '#CC8D17',
     // backgroundColor: 'lightblue',
     alignSelf: 'center',

      padding: 10,
      fontSize: 25,
    },
    
    buttonStyle: {
      alignSelf: 'flex-start',
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#CC8D17',
      padding: 10,
      marginBottom: 12,
      
      marginTop: 5,
    },
    titleStyle:{
      marginTop : 50,
      color: '#CC8D17',
     
     // backgroundColor: 'lightblue',
      padding: 10,
      fontSize: 25,
  
    },
  
  
  
    formItem: {
      
      padding: 10,
      marginTop: 5,
  //marginBottom: 0
    },
    
    formLabel: {
      fontSize: 15,
      color: '#CC8D17',
      marginTop: -20,
     // marginBottom: 10
    
    },
    formInput: {
      borderWidth: 1,
      borderColor: '#CC8D17',
      borderRadius: 20,
    },
    formTouch: {
     // backgroundColor: '#0000000',
    // marginTop: 10,
      padding: 1,
      alignItems: 'center',
    },
    formTouchText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#CC8D17',
    },
  
    container: {
      flex: 1,
      flexDirection: "column"
    },
    image: {
      flex:1,

      
      resizeMode: "cover",
      justifyContent: "center",
      alignSelf: 'stretch',
    },
    imageStretch: {
        
      alignSelf: 'stretch',
      
      flexDirection: 'row',
     // justifyContent: 'center',
      alignItems: 'stretch',
      height: 160,
     // width: 180,
      //borderRadius: 300/15,
      
     
    },
    
    txtInitials:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#CC8D17',
        fontSize: 20
    } ,
    headLine:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 18,
        paddingBottom: 20
    } 
    
    
   
    ,
    text: {
      color: "black",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#000000a0"
    },

    cancelText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E74C3C',
      },
      deleteText :
      {
        fontWeight: 'bold',
        color: 'red',

      }

      ,



    fields: {
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginVertical: 15,
        fontSize: 20,
        
    
      }
      ,

  
          fixToText: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          },

          fixTogether: {
            flexDirection: 'row',
        
            justifyContent: 'center',
          },

      textStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: '#BA4A00',
        fontWeight: '600',
        paddingTop: 6,
        paddingBottom: 6
      },
      textHeader: {
        fontSize: 15,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        color: '#171919',
        fontWeight: '600',
    
        paddingBottom: 6
      },
    
     
      centeredTxt:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        fontSize: 18
      } ,
  
      cancelStyle: {
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'red',
        marginLeft: 20,
        marginRight: 20,
        padding: 9,
        marginBottom: 15,
      },
      imageStyle: {
        
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
       // alignItems: 'stretch',
        height: 160,
        width: 180,
        borderRadius: 300/15,
      },

      reviewImag: {
        
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
       // alignItems: 'stretch',
        height: 120,
        width: 140,
        borderRadius: 300/15,
      },




      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      clickable: {
        fontWeight: "bold",
        fontSize: 25,
        textDecorationLine : "underline"
    
      }
      ,

    
    
    preview: { flex: 1, 
      justifyContent: 'flex-end'
      , alignItems: 'center'
     },
    capture: {
        flex: 0
        , borderRadius: 5,
         padding: 15, 
         paddingHorizontal: 20,
        alignSelf: 'center',
         margin: 20,
    },
    camButton: {
     // marginTop : 50
     //paddingBottom:-10,
     //paddingTop: 20
     marginTop: 40
     

    }
   

      


  });

  export default styles;
  