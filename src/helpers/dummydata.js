//OBS Scene List Object
import axios from 'axios'
import {clientID} from "../common/common"
const headers= {"headers": {
  "Client-ID": clientID

}}
// const URL = "https://api.twitch.tv/kraken/streams/?channel=drdisrespect,shroud,chocotaco,tsm_viss,parasite,goldglove"
// export const streamer = ()=>{
//   axios.get(URL, headers).then(data=>{
//   console.log(data.data.streams[0].channel.name,"AXIOS DATA")
//   return data.data.streams[0].channel.name
// })
// return "parasite"
// }
export const dumbData = {
       
  accessToken: "bwivcc7mjes0btlvhkmsuxv8acdjdo",
  
  displayName: "streampanelapp",
  
  twitchId: "277053577",
  
      
}

const idOBJ={
  chocotaco:"69906737",
  imaqtpie: "24991333",
  hutch: "8815236",
  drdisrespect: "17337557",
  teepee: "23844396",
  goldglove: "1518077",
  karma:"10406",
  scump: "13240194",
  nameless: "10328157",
  sparkles_qt: "166901339",
  shroud: "37402112",
  destiny: "18074328",
  streampanelapp: "277053577",
  katgunn: "23822990",
  callofduty: "501281",
  fathersongaming: "219249",
  sandyravage: "8957332",
  summit1g: "26490481",
  courageJD:"106125347",
  callofduty: "501281",
  mrsnewbhero: "74527399"

}


export const streamer = "streampanelapp"
export const streamerID= idOBJ[streamer]
export const OBSSceneObj = 
{ 'current-scene': 'In-Game',
  'message-id': '1',
  scenes: 
   [ { name: 'Starting Soon', sources: [Array] },
     { name: 'Main', sources: [Array] },
     { name: 'Pre-Game Lobby', sources: [Array] },
     { name: 'Parachute', sources: [Array] },
     { name: 'BRB', sources: [Array]},
     { name: 'In-Game', sources: [] } ],
  status: 'ok',
  currentScene: 'In-Game',
  messageId: '1' }


  export const OBSSourcesObj = 
  { 'message-id': '2',
    sources: 
            [ { name: 'newsub', type: 'input', typeId: 'text_ft2_source' },
                { name: 'camera', type: 'input', typeId: 'av_capture_input' },
                { name: 'Color Source', type: 'input', typeId: 'color_source' },
                { name: 'drdisrespect.jpg',
                type: 'input',
                typeId: 'image_source' },
                { name: 'Browser', type: 'input', typeId: 'browser_source' },
                { name: 'Mic/Aux',
                type: 'input',
                typeId: 'coreaudio_input_capture' } ],
  status: 'ok',
  messageId: '2' }




















