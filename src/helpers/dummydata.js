//OBS Scene List Object
export const streamer = "drdisrespect"

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