import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, Paragraph } from 'react-native-paper'
import LottieView from "lottie-react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default function CustomCard({data, isLiked, isVerified, onLike = () => {}}) {


    const animation = React.useRef(null);
    const isFirstRun = React.useRef(true);

    React.useEffect(() => {
        if (isFirstRun.current) {
          if (isLiked) {
            animation.current.play(66, 66);
          } else {
            animation.current.play(19, 19);
          }
          isFirstRun.current = false;
        } else if (isLiked) {
          animation.current.play(19, 50);
        } else {
          animation.current.play(0, 19);
        }
      }, [isLiked]);

    return(
        <Card style={styles.cardContainer} key={data.id}>
            <Card.Cover source={{ uri: data.photo ? data.photo : "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} />
            <Card.Title 
                title={data.name}
                subtitle={data.address}
                right={(props) => 
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    {isVerified ? <Icon style={{marginTop: 15}} name='check-decagram' color='#6200ee' size={18}/> : <View></View>}
                    <TouchableOpacity
                      onPress={() => {
                          onLike(data.id)
                      }}
                    >
                      <LottieView
                          ref={animation}
                          style={styles.heartLottie}
                          source={require("../../assets/like.json")}
                          autoPlay={false}
                          loop={false}
                    />
                    </TouchableOpacity>
                  </View>
                }
            />
            <Card.Content>
                <Paragraph>{data.description}</Paragraph>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 10,
    },
    heartLottie: {
        width: 50,
        height: 50,
        marginLeft: -5,
      },
});