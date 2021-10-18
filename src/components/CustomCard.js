import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity } from 'react-native';
import { Card, Paragraph } from 'react-native-paper'
import LottieView from "lottie-react-native";


export default function CustomCard({data, isLiked, onLike = () => {}}) {


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
        <Card style={styles.cardContainer} key={data.id} onPress={() => console.log('HERE')}>
            <Card.Cover source={{ uri: data.photo ? data.photo : "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} />
            <Card.Title 
                title={data.name}
                subtitle={data.address}
                right={(props) => 
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