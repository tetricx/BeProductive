import { FontAwesome5 } from '@expo/vector-icons';
import React, {useState, useEffect} from 'react'
import {ActivityIndicator, StyleSheet,View, Text, Image, FlatList, Button} from 'react-native'
import firebase from 'firebase/compat/app'
import {connect} from 'react-redux'
import { container, text, utils } from '../styles';
import 'firebase/compat/firestore';
function Profile(props) {
  const [userPost, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const {currentUser, posts} = props;
    //console.log({currentUser,posts})
    if(props.route.params.uid === firebase.auth().currentUser.uid){
      setUser(currentUser)
      setUserPosts(posts)
      setLoading(false)
    }
    else{
      firebase.firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            props.navigation.setOptions({
                title: snapshot.data().username,
            })

            setUser({ uid: props.route.params.uid, ...snapshot.data() });
        }
        setLoading(false)
        })
      firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy("creation","desc")
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data}
            })
            //console.log(posts)
            setUserPosts(posts)
        })
      
    }
    if(props.following.indexOf(props.route.params.uid)>-1){
      setFollowing(true);

    }
    else{
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following, props.currentUser, props.posts])

  const onFollow = () => {
    //console.log("followed")
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .set({})

    //props.sendNotification(user.notificationToken, "New Follower", `${props.currentUser.name} Started following you`, { type: 'profile', user: firebase.auth().currentUser.uid })
  }
  const onUnfollow = () => {
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .delete()
  }

  const onLogout = () => {
    firebase.auth().signOut();
  }

  if (loading) {
    return (
        <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
            <ActivityIndicator style={{ alignSelf: 'center', marginBottom: 20 }} size="large" color="#00ff00" />
            <Text style={[text.notAvailable]}>Loading</Text>
        </View>
    )
  }
  if (user === null) {
    return (
        <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
            <FontAwesome5 style={{ alignSelf: 'center', marginBottom: 20 }} name="dizzy" size={40} color="black" />
            <Text style={[text.notAvailable]}>User Not Found</Text>
        </View>
    )
  }
  return (
    <View style = {styles.container}>
      <View style = {styles.containerInfo}>
        <Text> {user.name} </Text>
        <Text> {user.email} </Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                    </View>
                ) : 
                
                <View>
                    <Button
                        title="Logout"
                        onPress={() => onLogout()}
                    />
                </View>}
      </View>
      <View style = {[utils.borderTopGray]}>
        <FlatList 
        numColumns={3}
        horizontal={false}
        data = {userPost}
        renderItem={({item}) => (
          <View style ={styles.containerImage}>
            <Image style = {styles.image} source ={{uri: item.downloadURL}}/>
          </View>
        )}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container : {
    flex:1,
    marginTop:40
  },
  containerInfo:{
    margin: 20
  },
  containerGallery:{
    flex:1
  },
  image:{
    flex:1,
    aspectRatio: 1/1
  },
  containerImage:{
    flex: 1/3,
    aspectRatio: 1/1
  }

})
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)