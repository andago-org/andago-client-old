import {
  Conversation, UserAgent, Stream, StreamInfo
} from '@apizee/apirtc';

const API_KEY = 'd05f1b6c93117e7bb6ead384d230036f';

class ApiRtc
{
  public userAgent = new UserAgent({ uri: 'apiKey:' + API_KEY }) as UserAgent
  public conversation = null as Conversation | null;
  public localStream = null as Stream | null;
  public remoteStreamId = "" as string;
  public listenerCreated = false as boolean;

  public connect(name: string)
  {
    name = String(name)

    if (this.conversation !== null) {
      return
    }

    console.log('Connect to ApiRTC')

    this.userAgent.register({
      cloudUrl: 'https://cloud.apirtc.com'
    }).then((session) => {
      this.conversation = session.getOrCreateConversation(name)

      if (!this.listenerCreated)
      {
        this.createListeners()
        this.listenerCreated = true
      }
      
      // Define the way the local stream will be configured
      const streamOptions: any = {
        constraints: {
          audio: true,
          video: false,
        },
      }

      this.userAgent?.createStream(streamOptions).then((stream: Stream) => {
        this.localStream = stream
        //Display the stream (audio) in the <audio> element with id 'local'
        stream.attachToElement(document.getElementById('localAudio') as HTMLAudioElement)
        
        //Join the conversation
        this.conversation?.join().then(() => {
          //Publish the local stream in the conversation
          this.conversation?.publish(stream)
        });
      });
    });
  }

  public createListeners()
  {
    this.conversation?.on('streamListChanged', (streamInfo: StreamInfo) => {
      // const contactId = String(streamInfo.contact.getId());
      if (streamInfo.isRemote === true) {
        if (streamInfo.listEventType === 'added') {
          this.remoteStreamId = String(streamInfo.streamId);
          // a remote stream was published
          console.log(streamInfo)
          this.conversation?.subscribeToMedia(this.remoteStreamId)

        } else if (streamInfo.listEventType === 'removed') {
          // a remote stream is not published anymore
        }
      }
    });

    this.conversation?.on('streamAdded', function (stream: Stream) {
      stream.attachToElement(document.getElementById('remoteAudio') as HTMLAudioElement)
    })
  }

  public disconnect()
  {
    if (!this.conversation)
    {
      return
    }

    this.conversation?.leave().then(() => {
      // this.conversation?.removeListener('added', (stream: any) => {
      //   stream.attachToElement(document.getElementById('remoteAudio') as HTMLAudioElement)
      // }))
      this.conversation?.stopRecording()
      this.conversation?.unpublish(this.localStream as Stream)
      this.conversation?.unsubscribeToMedia(this.remoteStreamId)
      this.conversation?.destroy()
      this.userAgent.unregister()
      
    })

    this.conversation = null
  }
}

const apiRtc = new ApiRtc();

export default apiRtc;