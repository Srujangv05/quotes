import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import {View, Text, TouchableOpacity, Linking, StyleSheet, Share} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function HomeScreen() {
  const [Quote, setQuote] = useState('Loading...');
  const [Author, setAuthor] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);

  const randomQuote = () => {
    setIsLoading(true);
    fetch("https://dummyjson.com/quotes/random").then(res => res.json()).then(result => {
      //console.log(result);
      setQuote(result.quote);
      setAuthor(result.author);
      setIsLoading(false);
    })
  }

  // const fetchQuoteById = async (id) => {
  //   console.log(id);
  //   const response = await fetch('https://funny-gazelle-51.hasura.app/v1/graphql', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-hasura-admin-secret': 'crJVX1O5KQMIoTVp6ZqPSpk4qgEGLG8gskh3h28TVXMU34l7VVXydJmuMTzseiWk',
  //     },
  //     body: JSON.stringify({
  //       query: `
  //         query MyQuery($id: Int!) {
  //           quotes(where: {id: {_eq: $id}}) {
  //             quote
  //             author
  //           }
  //         }
  //       `,
  //       variables: { id },
  //     }),
  //   });
  
  //   const result = await response.json();
  //   console.log(result.data.quotes);
  //   return result.data.quotes;
  // };

  // const getRandomInt = (min, max) => {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };
  
  // const randomId = getRandomInt(1, 100);
  // fetchQuoteById(randomId).then(quotes => console.log(quotes));
  

  useEffect(() => {
    randomQuote();
  }, []);

  const copyToClipboard = () => {
    //Clipboard.setString(Quote);
    alert('Quote copied to clipboard');   
  }

  const tweetNow = () => {
    const url = "https://twitter.com/intent/tweet?text=" + Quote;
    Linking.openURL(url);
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${Quote} - ${Author}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared');
        } else {
          // shared
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Dismissed');
      }
    } catch (error) {
      console.log(error.message);
    }
  };




  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BlurView intensity={50} style={styles.quoteContainer}>
        <Text style={styles.title}>Quote of the Day</Text>
        <FontAwesome5 name="quote-left" style={styles.quoteLeftIcon} color="#000" />
        <Text style={styles.quoteText}>{Quote}</Text>
        <FontAwesome5 name="quote-right" style={styles.quoteRightIcon} color="#000" />
        <Text style={styles.authorText}>—— {Author}</Text>
        <TouchableOpacity onPress={randomQuote} style={[styles.nextButton, { backgroundColor: isLoading ? 'rgba(83, 114, 240, 0.7)' : 'rgba(83, 114, 240, 1)' }]}>
          <Text style={styles.nextButtonText}>{isLoading ? "Loading..." : "Next"}</Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={onShare} style={styles.socialButton}>
            <FontAwesome5 name="share" size={22} color="#5372F0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={tweetNow} style={styles.socialButton}>
            <FontAwesome name="twitter" size={22} color="#5372F0" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  quoteContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  quoteLeftIcon: {
    fontSize: 20,
    marginBottom: -12,
  },
  quoteText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 1.1,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  quoteRightIcon: {
    fontSize: 20,
    textAlign: 'right',
    marginTop: -20,
    marginBottom: 20,
  },
  authorText: {
    textAlign: 'right',
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    padding: 20,
    borderRadius: 30,
    marginVertical: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    borderWidth: 2,
    borderColor: '#5372F0',
    borderRadius: 50,
    padding: 15,
  },
});
