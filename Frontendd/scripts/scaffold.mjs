import { mkdirSync, writeFileSync } from "fs";
const dirs = ["src","src/styles","src/store","src/components","src/pages","src/rtc","src/utils","scripts"];
dirs.forEach(d=>{ try{ mkdirSync(d,{recursive:true}); }catch{} });
const files = {
  "index.html":"<!-- paste from answer -->",
  "vite.config.ts":"// paste from answer",
  "package.json":"// paste from answer",
  "src/main.tsx":"// paste from answer",
  "src/router.tsx":"// paste from answer",
  "src/App.tsx":"// paste from answer",
  "src/styles/globals.css":"/* paste from answer */",
  "src/styles/room.css":"/* paste from answer */",
  "src/store/meetingStore.ts":"// paste from answer",
  "src/store/chatStore.ts":"// paste from answer",
  "src/components/VideoTile.tsx":"// paste from answer",
  "src/components/ControlsBar.tsx":"// paste from answer",
  "src/components/ParticipantsPanel.tsx":"// paste from answer",
  "src/components/ChatPanel.tsx":"// paste from answer",
  "src/components/DeviceSelector.tsx":"// paste from answer",
  "src/components/TimerSyncIndicator.tsx":"// paste from answer",
  "src/components/LayoutGrid.tsx":"// paste from answer",
  "src/pages/Lobby.tsx":"// paste from answer",
  "src/pages/Room.tsx":"// paste from answer",
  "src/rtc/signaling.ts":"// paste from answer",
  "src/rtc/webrtc.ts":"// paste from answer",
  "src/rtc/recording.ts":"// paste from answer",
  "src/rtc/uploader.ts":"// paste from answer",
  "src/rtc/timeSync.ts":"// paste from answer",
  "src/rtc/devices.ts":"// paste from answer",
  "src/rtc/screenshare.ts":"// paste from answer",
  "src/utils/id.ts":"// paste from answer",
  "src/utils/media.ts":"// paste from answer",
  ".env.example":"VITE_SIGNALING_URL=ws://localhost:3001\nVITE_API_BASE=http://localhost:3002\n"
};
Object.entries(files).forEach(([p,c])=>writeFileSync(p,c));
console.log("Scaffolded. Paste code into files, then zip the folder.");
