import { useState, useEffect, useCallback, useRef } from "react";

// Safe array helper - converts anything to array
const toArr = v => Array.isArray(v) ? v : (v && typeof v === 'string' ? [v] : []);

const DEMO = [
  {id:"demo1",date:"2025-01-30",title:"噴灌及水井系統檢修案",equipment_type:"景觀綠化",location:"全區",problem_description:"8區噴灌系統6區異常無法啟動",solution:"找原廠天麒檢修",selected_vendor:"天麒景觀",amount_total:6825,warranty:0,urgency:"medium",tags:["景觀","噴灌"]},
  {id:"demo2",date:"2025-01-30",title:"瑜珈教室白蟻防治案",equipment_type:"病蟲害防治",location:"瑜珈教室",problem_description:"住戶發現白蟻",solution:"金牌殺手施作",selected_vendor:"金牌殺手除蟲滅鼠企業社",amount_total:18000,warranty:5,urgency:"medium",tags:["白蟻","比價"]},
  {id:"demo3",date:"2026-02-06",title:"B1F防火鐵捲門控制更改工程",equipment_type:"門禁/鐵捲門",location:"B1F",problem_description:"總機當機導致鐵捲門異常下放",solution:"中繼器改探測器連動",selected_vendor:"漢神機電消防工程",amount_total:103950,warranty:0,urgency:"high",tags:["消防","緊急"]},
  {id:"demo4",date:"2026-01-15",title:"各棟R樓安全門修繕",equipment_type:"門禁/鐵捲門",location:"各棟R樓",problem_description:"安全門損壞共10件",solution:"澤匠施作",selected_vendor:"澤匠",amount_total:53200,warranty:1,urgency:"medium",tags:["安全門","比價"]},
  {id:"demo5",date:"2024-11-20",title:"電梯定期保養",equipment_type:"電梯",location:"A棟",problem_description:"年度定期保養",solution:"原廠保養",selected_vendor:"三菱電梯",amount_total:50400,warranty:1,urgency:"low",tags:["電梯","例行"]},
  {id:"demo6",date:"2024-08-10",title:"地下室污水泵浦維修",equipment_type:"給排水",location:"B2F機房",problem_description:"污水泵浦異響出水量不足",solution:"更換馬達",selected_vendor:"鴻陽機電",amount_total:36750,warranty:1,urgency:"high",tags:["給排水","緊急"]},
  {id:"demo7",date:"2024-05-18",title:"公共照明LED更換",equipment_type:"公共照明",location:"地下停車場",problem_description:"停車場燈管老化閃爍",solution:"全面更換LED",selected_vendor:"台灣電工",amount_total:28000,warranty:2,urgency:"low",tags:["照明","LED"]},
  {id:"import1",date:"2026-04-14",title:"F棟集體漏水-禹翰進水管壓力測試",equipment_type:"給排水",location:"F棟",problem_description:"F棟集體漏水，禹翰施作48戶壓力測試",solution:"禹翰進水管壓測",selected_vendor:"禹翰工程行",amount_total:288000,warranty:0,urgency:"high",tags:["給排水","F棟","壓力測試"]},
  {id:"import1b",date:"2026-04-14",title:"F棟集體漏水-禹翰後續修復",equipment_type:"給排水",location:"F棟",problem_description:"後續修復：打鑿、管路、回填磁磚，待壓測結果決定",solution:"禹翰工程行修復",selected_vendor:"禹翰工程行",amount_total:894300,warranty:0,urgency:"medium",tags:["給排水","F棟","待決定"]},
  {id:"aef_gate1",date:"2026-05-16",title:"AEF棟大門修繕案",equipment_type:"門禁/鐵捲門",location:"A棟、E棟、F棟大門",
    problem_description:"住戶反映AEF棟大門損壞（原無通報系統，由管委員手動輸入）。上週保全巡視發現F棟同樣問題亦通報。多方通報同一設施，彙整為AEF棟大門修繕案。",
    solution:"目前僅取得1家報價，例會決議需再找第二家比價後議價，避免單一報價無競價壓力導致費用偏高。",
    selected_vendor:"待議價",amount_total:0,warranty:0,urgency:"high",
    tags:["門禁/鐵捲門","大門","待比價","住戶通報","保全巡視","AEF棟"],
    status:"pending",
    case_background:{
      discovery:"住戶口頭反映（A棟、E棟）+ 保全巡視發現（F棟）",
      reported_by:"管委員手動輸入通報系統",
      issue:"通報當時無修繕系統對接，未來整合後可自動建案",
      current_status:"目前僅1家報價，例會決議再找第二家比價",
      next_action:"取得第二家報價後上傳比價分析，AI評估後再議價"
    },
    showcase_note:"本案為修繕管理系統建構的真實案例。過去住戶反映問題靠口耳相傳，保全巡視靠紙本記錄，比價靠人工整理，例會討論靠記憶。有了系統後：通報自動建案、AI輔助比價、決議有記錄、議價有策略，讓管委會決策更透明、更有依據。",
    vendor_background:"東昱鋼鋁五金企業有限公司已有兩筆施工紀錄：(1) A.E.大門門扇上臂調整固定 $7,350；(2) A.E.F棟地鉸鏈+門扇上臂更換(DORMA BTS-80) $66,150。東昱熟悉社區大門規格與現場狀況，但正因如此更要比價，避免因熟悉而報高價。議價時可提醒東昱：社區已有合作基礎，若報價合理願意繼續合作，以此換取更好的價格條件。"
  },
  {id:"driveway1",date:"2026-04-10",title:"車道出入口通道整修施工工程",equipment_type:"停車場",location:"車道出入口",
    problem_description:"車道出入口通道地坪整修，施工面積約63平方公尺。共3家廠商比價，6份報價單（每家各提供2種工法方案）。工法分兩種：RC壓花地坪工法與柏油鋪設工法。4/10例會決議選譽展實業柏油方案，4/27完工。",
    solution:"決議譽展實業施作柏油工法（$178,605含稅），已於2026-04-27完工。注意：RC壓花工法耐用年限20-30年，耐用性較佳，下次重鋪建議優先考慮。",
    selected_vendor:"譽展實業",amount_total:178605,warranty:0,urgency:"medium",construction_date:"2026-04-27",completion_status:"已完工",
    tags:["停車場","車道","地坪","已完工","柏油","比價"],
    decision:{vendor:"譽展實業",amount:"178605",date:"2026-04-10",followup:"",
      reason:"柏油工法費用較低、工期短，4/10例會決議採用。RC壓花雖較耐用但費用較高，下次重鋪時優先考慮。"},
    compare_report:{
      case_name:"車道出入口通道整修施工工程",
      summary:"共3家廠商比價，6份報價單（每家各提供RC壓花與柏油兩種方案）。柏油方案報價區間$178,605至$264,600，RC壓花方案報價區間更高。譽展實業柏油方案$178,605為最低價，例會決議採用。",
      vendors:[
        {name:"吉詰營造工程有限公司",amount:263151,key_specs:["RC壓花地坪工法","施工面積63坪"],strengths:["施工經驗豐富"],weaknesses:["報價偏高"],spec_score:7,value_score:4,notes:"RC壓花方案"},
        {name:"譽展實業（方案A-RC壓花）",amount:218295,key_specs:["RC壓花地坪工法","施工面積63坪"],strengths:["品質較佳","耐用20-30年"],weaknesses:["費用較高"],spec_score:9,value_score:6,notes:"RC壓花耐用但費用高"},
        {name:"譽展實業（方案B-柏油）",amount:178605,key_specs:["柏油鋪設工法","施工面積63坪"],strengths:["費用最低","工期短"],weaknesses:["耐用性較差，約5-8年需重鋪"],spec_score:7,value_score:9,notes:"決議採用"},
        {name:"駿磊工程",amount:273000,key_specs:["RC壓花地坪工法","施工面積63坪"],strengths:["施工品質穩定"],weaknesses:["報價最高"],spec_score:7,value_score:3,notes:"報價最高"}
      ],
      spec_comparison:[
        {item:"工法",values:{"吉詰營造":"RC壓花","譽展方案A":"RC壓花","譽展方案B（決議）":"柏油","駿磊":"RC壓花"}},
        {item:"含稅金額",values:{"吉詰營造":"$263,151","譽展方案A":"$218,295","譽展方案B（決議）":"$178,605","駿磊":"$273,000"}},
        {item:"耐用年限",values:{"吉詰營造":"20-30年","譽展方案A":"20-30年","譽展方案B（決議）":"5-8年","駿磊":"20-30年"}}
      ],
      recommendation:{
        top_pick:"譽展實業（方案B-柏油）",
        reason:"本次例會考量預算，決議採柏油方案。譽展實業報價最低且有完整施工方案。惟長期而言RC壓花耐用性更佳，建議下次重鋪時改採RC壓花工法。",
        negotiation_tips:["已是最低報價，議價空間有限","可要求加強保固條件","確認施工後排水坡度是否符合規範"],
        risk_warnings:["柏油方案預計5-8年後需重鋪，屆時費用需再編列","台灣夏天高溫柏油易軟化，需定期巡視","建議保留RC壓花比價資料供下次重鋪參考"]
      }
    }
  },
  {id:"import2",date:"2025-04-16",title:"F棟集體漏水-錦洋分戶幹管壓測",equipment_type:"給排水",location:"F棟",problem_description:"錦洋施作48戶冷水給水管壓力測試",solution:"錦洋壓力測試加報告書",selected_vendor:"錦洋工程行",amount_total:186900,warranty:0,urgency:"high",tags:["給排水","F棟","壓力測試"]},
  {id:"gate_prev1",date:"2025-12-26",title:"車道柵欄更新工程－去年中保報價（2台方案）",equipment_type:"停車場",location:"車道入口",
    problem_description:"民國114年12月26日中保無限報價，客製化電動柵欄機2台方案。項目含：客製化電動柵欄機×2、烤漆×2、倒數讀秒器×2、紅綠燈×6、感應線圈×4、車輛偵測器×4、室外防水箱×2、安裝工資×2。",
    solution:"此為歷史報價存檔，未採用。4月初與中保開會，請中保將客製化改為標準型號重新報價，今年中保以NB-35FD報價$145,530。",
    selected_vendor:"中興保全(SECOM)",amount_total:301350,warranty:1,urgency:"low",
    tags:["停車場","柵欄機","歷史報價","客製化","中保","存檔參考"],
    notes:"4月初與中保會議，請中保將客製化改為標準型號更新報價，以利後續比價作業。"},
  {id:"gate_prev2",date:"2025-12-26",title:"車道柵欄更新工程－去年中保報價（5台方案）",equipment_type:"停車場",location:"車道入口",
    problem_description:"民國114年12月26日中保無限報價，客製化電動柵欄機5台方案。項目含：客製化電動柵欄機×5、烤漆×5、倒數讀秒器×5、紅綠燈×15、感應線圈×13、車輛偵測器×13、室外防水箱×5、安裝工資×5。",
    solution:"此為歷史報價存檔，未採用。5台客製化方案，供規模評估參考。4月初與中保開會後，決議改以標準型號重新報價並進行比價。",
    selected_vendor:"中興保全(SECOM)",amount_total:779835,warranty:1,urgency:"low",
    tags:["停車場","柵欄機","歷史報價","客製化","中保","存檔參考","5台方案"],
    notes:"5台客製化方案歷史存檔，供後續委員了解規格演變過程參考。"},
  {id:"gate1",date:"2026-05-16",title:"車道柵欄更新工程",equipment_type:"停車場",location:"車道入口",
    problem_description:"車道柵欄老化需更新，NB-35FD x2、感應線圈x4、車輛偵測器x4。共5家比價：鎧成$93,450、JGNet$95,000、巨璣$119,700、翎峰$138,600、中保$145,530。",
    solution:"決議由中保無限施作，原因為車辨系統已使用中保，考量系統相容性避免跨品牌整合問題，待議價確認。",
    selected_vendor:"中保無限(SECOM)",amount_total:145530,warranty:1,urgency:"high",
    tags:["停車場","柵欄機","系統相容性","比價","待議價"],
    negotiation_strategy:{
      target_price:"$110,000～$120,000",
      steps:[
        "第一步：先要求說明。不要直接殺價，先問：NB-35FD與NB-350規格差異為何？感應線圈為何需要4組而非標準2組？讓中保解釋，說不清楚自然有降價空間。",
        "第二步：拿數字說話。告知已收5家報價，最低$93,450，JGNet$95,000規格相近，中保$145,530差距超過5萬，希望重新檢視報價。",
        "第三步：針對項目議價。安裝工資$42,000（2組x$21,000）明顯偏高，其他廠商約$10,000。要求降至$15,000-$18,000，可省約$24,000。感應線圈若堅持4組必要，需提供書面說明。",
        "第四步：加碼不殺價。若中保不願降價，改談：保固從1年延至2年、免費第一年定期保養2次、地面切割回填費用含在報價內。"
      ],
      key_questions:[
        "NB-35FD與NB-350功能差異為何？可提供規格書嗎？",
        "感應線圈為何需要4組而非標準2組？",
        "安裝工資每組$21,000的計算依據為何？",
        "地面切割及回填費用是否已含在報價內？"
      ],
      notes:"中保品牌售後服務完整、淡水在地服務是優勢，但性價比偏低。議價時保持友善但堅定，強調長期合作，目標讓中保主動調整而非強迫降價。"
    }
  },
];

const COLORS = ["#2d6a4f","#52b788","#b45309","#1d4ed8","#b91c1c","#6d28d9","#0891b2"];
const EQ_TYPES = ["電梯","消防系統","給排水","景觀綠化","門禁/鐵捲門","停車場","公共照明","空調","病蟲害防治","其他"];
const fmt = n => n ? "$" + Number(n).toLocaleString() : "—";
const rYear = r => r.date ? parseInt(r.date.split("-")[0]) : 0;
const rMonth = r => r.date ? parseInt(r.date.split("-")[1]) : 0;
const thisYear = () => new Date().getFullYear();

const S = {
  sidebar:{ width:220,background:"#1b4332",display:"flex",flexDirection:"column",height:"100vh",position:"fixed",top:0,left:0,zIndex:100,overflowY:"auto" },
  main:{ marginLeft:220,flex:1,minHeight:"100vh",background:"#f5f4f0" },
  topbar:{ background:"#fff",borderBottom:"1px solid #e2e0d8",padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50 },
  content:{ padding:24 },
  card:{ background:"#fff",border:"1px solid #e2e0d8",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,.07)",marginBottom:20 },
  ch:{ padding:"14px 18px",borderBottom:"1px solid #e2e0d8",display:"flex",alignItems:"center",justifyContent:"space-between" },
  cb:{ padding:18 },
  btnP:{ background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6 },
  btnG:{ background:"transparent",color:"#888580",border:"1px solid #e2e0d8",borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer" },
  btnD:{ background:"#b91c1c",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer" },
  inp:{ width:"100%",padding:"8px 11px",border:"1px solid #ccc9be",borderRadius:8,fontSize:13,background:"#fff",color:"#1a1916",outline:"none",boxSizing:"border-box" },
  lbl:{ display:"block",fontSize:11,fontWeight:500,color:"#888580",marginBottom:5 },
  th:{ textAlign:"left",padding:"9px 13px",fontSize:11,color:"#888580",fontWeight:500,borderBottom:"2px solid #e2e0d8",background:"#faf9f6" },
  td:{ padding:"10px 13px",fontSize:13,borderBottom:"1px solid #e2e0d8",verticalAlign:"top" },
  ni:(a)=>({ display:"flex",alignItems:"center",gap:10,padding:"9px 20px",color:a?"#fff":"rgba(255,255,255,.6)",cursor:"pointer",fontSize:13,borderLeft:a?"3px solid #52b788":"3px solid transparent",background:a?"rgba(255,255,255,.1)":"transparent",transition:".15s",margin:"1px 0" }),
  bdg:(t)=>{ const m={green:{background:"#e8f4ef",color:"#1b4332"},amber:{background:"#fef3c7",color:"#b45309"},red:{background:"#fee2e2",color:"#b91c1c"},blue:{background:"#dbeafe",color:"#1d4ed8"},gray:{background:"#f1efea",color:"#888580"}};const s=m[t]||m.gray;return{...s,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:500,display:"inline-block"}; },
};

function UBadge({u}){ const m={high:["red","🔴 緊急"],medium:["amber","🟡 一般"],low:["green","🟢 例行"]};const[t,l]=m[u]||["gray","—"];return <span style={S.bdg(t)}>{l}</span>; }
function SC({label,value,sub,color="#1a1916"}){ return <div style={{background:"#fff",border:"1px solid #e2e0d8",borderRadius:10,padding:"16px 18px",boxShadow:"0 1px 3px rgba(0,0,0,.07)"}}><div style={{fontSize:12,color:"#888580",marginBottom:6}}>{label}</div><div style={{fontSize:24,fontWeight:700,color,lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#b5b2a9",marginTop:6}}>{sub}</div>}</div>; }
function BC({data,clr="#2d6a4f"}){ const max=Math.max(...data.map(d=>d.v),1);return <div>{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}><span style={{width:100,fontSize:11,color:"#888580",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.l}</span><div style={{flex:1,height:20,background:"#f5f4f0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(d.v/max*100).toFixed(1)}%`,background:d.c||clr,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8,fontSize:11,color:"#fff",transition:"width .6s"}}>{d.v>0?d.s||"":""}</div></div>{d.r&&<span style={{width:70,fontSize:12,textAlign:"right",flexShrink:0}}>{d.r}</span>}</div>)}{data.length===0&&<p style={{color:"#888580",fontSize:13}}>暫無資料</p>}</div>; }

const toB64 = f => new Promise((res,rej)=>{
  const reader = new FileReader();
  reader.onerror = rej;
  if(f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf")){
    reader.onload = () => res(reader.result.split(",")[1]);
    reader.readAsDataURL(f);
    return;
  }
  reader.onload = () => {
    const img = new Image();
    img.onerror = rej;
    img.onload = () => {
      const MAX=1400, w0=img.width, h0=img.height;
      const sc = Math.min(1, MAX/w0, MAX/h0);
      const w=Math.round(w0*sc), h=Math.round(h0*sc);
      const cv = document.createElement("canvas");
      cv.width=w; cv.height=h;
      cv.getContext("2d").drawImage(img,0,0,w,h);
      res(cv.toDataURL("image/jpeg",0.82).split(",")[1]);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(f);
});

const callClaude = async (messages, maxTokens=1000) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages})
  });
  const d = await r.json();
  if(d.error) throw new Error(d.error.message);
  return d.content.map(c=>c.text||"").join("");
};

// ── Compare Page (standalone to avoid re-render focus loss) ──
function PageCompare({records, save}){
  const [files, setFiles] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [debug, setDebug] = useState("");
  const [dragging, setDragging] = useState(false);
  const [decision, setDecision] = useState({vendor:"",amount:"",reason:"",date:"",followup:""});
  const [decisionSaved, setDecisionSaved] = useState(false);
  const nameRef = useRef("");

  const addFiles = fs => {
    const valid = [...fs].filter(f => {
      const t=f.type.toLowerCase(), n=f.name.toLowerCase();
      return t.startsWith("image/")||t==="application/pdf"||n.endsWith(".jpg")||n.endsWith(".jpeg")||n.endsWith(".png")||n.endsWith(".pdf");
    });
    setFiles(prev=>{ const names=new Set(prev.map(x=>x.name)); return [...prev,...valid.filter(f=>!names.has(f.name))]; });
  };

  const run = async () => {
    if(files.length<2){ alert("請至少上傳 2 份報價單，目前 "+files.length+" 份"); return; }
    setAnalyzing(true); setReport(null); setDebug("");
    const contents = [];
    for(const f of files){
      setStatuses(p=>({...p,[f.name]:"loading"}));
      try{
        const b64 = await toB64(f);
        const isPdf = f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf");
        contents.push(isPdf
          ? {type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}}
          : {type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}});
        setStatuses(p=>({...p,[f.name]:"done"}));
      } catch(e){
        setStatuses(p=>({...p,[f.name]:"error"}));
        setDebug("讀取失敗: "+f.name+" | "+e.message);
      }
    }
    if(contents.length===0){ setDebug("所有檔案讀取失敗"); setAnalyzing(false); return; }

    const name = nameRef.current||"未命名案件";
    const sysPrompt = "你是台灣社區管委會工程採購顧問，擅長分析比價單。";
    const userPrompt = "Analyze "+contents.length+" vendor quotes for project: "+name+". Reply in Traditional Chinese. Return ONLY valid JSON, no markdown. Use only ASCII punctuation inside string values (avoid Chinese colons, brackets, quotes). Schema: {case_name,summary,vendors:[{name,amount(number),key_specs,strengths,weaknesses,spec_score(1-10),value_score(1-10),notes}],spec_comparison:[{item,values:{vendorName:value}}],recommendation:{top_pick,reason,negotiation_tips,risk_warnings}}";
    try{
      const raw = await callClaude([{role:"user",content:[...contents,{type:"text",text:sysPrompt+"\n\n"+userPrompt}]}], 4000);
      const s=raw.indexOf("{"), e=raw.lastIndexOf("}")+1;
      if(s<0||e<=0){ setDebug("找不到JSON: "+raw.slice(0,300)); setAnalyzing(false); return; }
      const jsonStr = raw.slice(s,e);
      try{
        // Clean common JSON issues from AI output
        const cleaned = jsonStr
          .replace(/「/g,'"').replace(/」/g,'"')  // 「」→ "
          .replace(/“/g,'"').replace(/”/g,'"')  // ""→ "
          .replace(/：/g,':')   // ：→ :
          .replace(/，/g,',')   // ，→ ,
          .replace(/[ --]/g,'') // control chars
          .replace(/,(\s*[}\]])/g,'$1');  // trailing commas
        const parsed = JSON.parse(cleaned);
        setReport(parsed);
        setDebug("");
      } catch(pe){
        // Try extracting just the JSON structure
        try{
          const reExtract = jsonStr.replace(/[「」“”]/g,'\"').replace(/：/g,':').replace(/，/g,',').replace(/,(\s*[}\]])/g,'$1');
          const s2=reExtract.indexOf("{"),e2=reExtract.lastIndexOf("}")+1;
          const parsed2 = JSON.parse(reExtract.slice(s2,e2));
          setReport(parsed2);
          setDebug("");
        } catch(pe2){
          setDebug("JSON錯誤: "+pe.message+" | 前300字: "+jsonStr.slice(0,300));
        }
      }
    } catch(e){
      setDebug("錯誤: "+e.message);
    }
    setAnalyzing(false);
  };

  const saveReport = () => {
    if(!report) return;
    const top = decision.vendor || report.recommendation?.top_pick;
    const tv = (report.vendors||[]).find(v=>v.name===top);
    const amt = decision.amount ? Number(decision.amount) : (Number(tv?.amount)||0);
    save([...records,{
      id:"cmp_"+Date.now(),
      date:decision.date||new Date().toISOString().split("T")[0],
      title:report.case_name||nameRef.current||"比價分析案件",
      equipment_type:"其他",location:"",
      problem_description:report.summary||"",
      solution:decision.reason||report.recommendation?.reason||"",
      selected_vendor:top||"",
      amount_total:amt,
      urgency:"medium",warranty:0,
      tags:["比價分析",decision.vendor?"已決議":"AI推薦"],
      decision:decision,
      compare_report:report,
    }]);
    setDecisionSaved(true);
    alert("✓ 比價報告與決議已儲存！");
  };

  const sc = s => s>=8?"#2d6a4f":s>=6?"#b45309":"#b91c1c";

  return (
    <div style={{display:"grid",gridTemplateColumns:"310px 1fr",gap:20,alignItems:"start"}}>
      <div>
        <div style={S.card}>
          <div style={S.ch}><span style={{fontWeight:600}}>上傳比價單</span></div>
          <div style={S.cb}>
            <div style={{marginBottom:12}}>
              <label style={S.lbl}>案件名稱</label>
              <input style={S.inp} placeholder="例：車道柵欄更新工程" defaultValue={nameRef.current} onChange={e=>{nameRef.current=e.target.value;}} />
            </div>
            <div
              style={{border:`2px dashed ${dragging?"#2d6a4f":"#ccc9be"}`,borderRadius:8,padding:"18px 14px",textAlign:"center",background:dragging?"#e8f4ef":"#faf9f6",marginBottom:10,transition:".15s"}}
              onDragEnter={e=>{e.preventDefault();e.stopPropagation();setDragging(true);}}
              onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragging(true);}}
              onDragLeave={e=>{e.preventDefault();e.stopPropagation();setDragging(false);}}
              onDrop={e=>{e.preventDefault();e.stopPropagation();setDragging(false);addFiles(e.dataTransfer.files);}}
            >
              <div style={{fontSize:24,marginBottom:6}}>{dragging?"📂":"📎"}</div>
              <p style={{fontWeight:600,fontSize:13,marginBottom:8}}>{dragging?"放開上傳":"選擇上傳方式"}</p>
              <label style={{background:"#2d6a4f",color:"#fff",borderRadius:7,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",display:"inline-block"}}>
                📁 選擇檔案
                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple style={{display:"none"}} onChange={e=>{ if(e.target.files.length>0) addFiles(e.target.files); e.target.value=""; }} />
              </label>
              <p style={{fontSize:10,color:"#b5b2a9",marginTop:8}}>JPG/PNG/PDF，每家一份</p>
            </div>
            {files.length>0&&<div style={{marginBottom:8,padding:"5px 10px",background:"#e8f4ef",borderRadius:6,fontSize:12,color:"#2d6a4f",fontWeight:500}}>已選 {files.length} 份</div>}
            {files.map(f=>{
              const st=statuses[f.name];
              const ss=st==="loading"?{background:"#dbeafe",color:"#1d4ed8"}:st==="done"?{background:"#e8f4ef",color:"#1b4332"}:st==="error"?{background:"#fee2e2",color:"#b91c1c"}:{background:"#f1efea",color:"#888580"};
              return <div key={f.name} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:"1px solid #e2e0d8",borderRadius:7,marginBottom:6,background:"#fff"}}>
                <span>📄</span><span style={{flex:1,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
                <span style={{...ss,borderRadius:20,padding:"2px 7px",fontSize:10}}>{st==="loading"?"讀取中":st==="done"?"✓":st==="error"?"失敗":"待分析"}</span>
              </div>;
            })}
            <button style={{...S.btnP,width:"100%",justifyContent:"center",marginTop:10,fontSize:14,padding:"11px 0",opacity:analyzing?.5:1}} disabled={analyzing} onClick={run}>
              {analyzing?"⏳ AI 分析中…":"🔍 開始比價分析 ("+files.length+"份)"}
            </button>
            {files.length>0&&!analyzing&&<button style={{...S.btnG,width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>{setFiles([]);setStatuses({});setReport(null);setDebug("");}}>清除</button>}
          </div>
        </div>
        <div style={{...S.card,borderLeft:"4px solid #2d6a4f",background:"#e8f4ef"}}>
          <div style={S.cb}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:6}}>💡 使用技巧</div>
            <ul style={{fontSize:12,color:"#555",paddingLeft:16,lineHeight:1.9}}>
              <li>每家廠商各上傳一份報價單</li>
              <li>照片盡量清晰，規格欄完整</li>
              <li>AI 自動比對型號、功能、保固</li>
              <li>分析後可一鍵存入修繕紀錄</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        {!report&&!analyzing&&!debug&&<div style={{...S.card,textAlign:"center",padding:60}}><div style={{fontSize:48,marginBottom:16,opacity:.2}}>⚖️</div><p style={{color:"#888580"}}>上傳各廠商報價單後<br/>AI 將自動分析規格差異與性價比</p></div>}
        {analyzing&&<div style={{...S.card,textAlign:"center",padding:60}}><div style={{fontSize:40,marginBottom:16}}>🔍</div><p style={{fontWeight:600,marginBottom:8}}>AI 正在逐一讀取並比對規格…</p><p style={{color:"#888580",fontSize:13}}>通常需要 15–30 秒</p></div>}
        {debug&&!report&&<div style={{...S.card,padding:16,background:"#fef3c7",border:"1px solid #b45309"}}><div style={{fontWeight:600,fontSize:13,marginBottom:8,color:"#b45309"}}>⚠ Debug</div><pre style={{fontSize:11,color:"#444",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{debug}</pre></div>}
        {report&&<div>
          <div style={{...S.card,borderLeft:"4px solid #2d6a4f"}}>
            <div style={S.ch}><span style={{fontWeight:600}}>📋 {report.case_name}</span><button style={S.btnP} onClick={saveReport}>💾 存入紀錄</button></div>
            <div style={S.cb}><p style={{fontSize:13,lineHeight:1.8,color:"#444"}}>{report.summary}</p></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:16}}>
            {toArr(report.vendors).map((v,i)=>{
              const isTop=v.name===report.recommendation?.top_pick;
              return <div key={i} style={{...S.card,marginBottom:0,border:isTop?"2px solid #2d6a4f":"1px solid #e2e0d8",position:"relative"}}>
                {isTop&&<div style={{position:"absolute",top:-10,right:10,background:"#2d6a4f",color:"#fff",fontSize:10,padding:"2px 10px",borderRadius:20,fontWeight:600}}>⭐ AI 推薦</div>}
                <div style={{...S.ch,background:isTop?"#e8f4ef":"#faf9f6"}}><span style={{fontWeight:700,fontSize:13}}>{v.name}</span><span style={{fontWeight:700,color:"#2d6a4f",fontSize:13}}>${Number(v.amount||0).toLocaleString()}</span></div>
                <div style={S.cb}>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    {[["規格合理",v.spec_score],["性價比",v.value_score]].map(([lbl,score])=>(
                      <div key={lbl} style={{flex:1,background:"#f5f4f0",borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                        <div style={{fontSize:10,color:"#888580",marginBottom:2}}>{lbl}</div>
                        <div style={{fontWeight:700,fontSize:20,color:sc(score)}}>{score}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:8}}><div style={{fontSize:11,color:"#888580",marginBottom:3}}>主要規格</div>{toArr(v.key_specs).map((s,j)=><div key={j} style={{fontSize:12,color:"#444",padding:"1px 0"}}>• {s}</div>)}</div>
                  {toArr(v.strengths).length>0&&<div style={{marginBottom:6}}><div style={{fontSize:11,color:"#2d6a4f",marginBottom:2}}>✓ 優點</div>{toArr(v.strengths).map((s,j)=><div key={j} style={{fontSize:12,color:"#2d6a4f"}}>• {s}</div>)}</div>}
                  {toArr(v.weaknesses).length>0&&<div style={{marginBottom:6}}><div style={{fontSize:11,color:"#b91c1c",marginBottom:2}}>⚠ 疑慮</div>{toArr(v.weaknesses).map((s,j)=><div key={j} style={{fontSize:12,color:"#b91c1c"}}>• {s}</div>)}</div>}
                  {v.notes&&<div style={{fontSize:11,color:"#888580",borderTop:"1px solid #e2e0d8",paddingTop:6,marginTop:6}}>{v.notes}</div>}
                </div>
              </div>;
            })}
          </div>
          {toArr(report.spec_comparison).length>0&&<div style={{...S.card,marginBottom:16}}>
            <div style={S.ch}><span style={{fontWeight:600}}>📊 規格對照表</span></div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr><th style={S.th}>比較項目</th>{toArr(report.vendors).map(v=><th key={v.name} style={{...S.th,color:v.name===report.recommendation?.top_pick?"#2d6a4f":"#888580"}}>{v.name}</th>)}</tr></thead>
                <tbody>{toArr(report.spec_comparison).map((row,i)=><tr key={i}><td style={{...S.td,fontWeight:500,background:"#faf9f6"}}>{row.item}</td>{toArr(report.vendors).map(v=><td key={v.name} style={{...S.td,fontSize:12}}>{(row.values||{})[v.name]||"—"}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>}
          {report.recommendation&&<div style={{...S.card,borderLeft:"4px solid #2d6a4f",background:"#e8f4ef"}}>
            <div style={S.ch}><span style={{fontWeight:600}}>🎯 AI 採購建議</span><span style={{fontWeight:700,color:"#2d6a4f"}}>推薦：{report.recommendation.top_pick}</span></div>
            <div style={S.cb}>
              <p style={{fontSize:13,lineHeight:1.8,marginBottom:14}}>{report.recommendation.reason}</p>
              {toArr(report.recommendation?.negotiation_tips).length>0&&<div style={{marginBottom:12}}>
                <div style={{fontWeight:600,fontSize:12,marginBottom:6}}>💰 議價建議</div>
                {toArr(report.recommendation?.negotiation_tips).map((t,i)=><div key={i} style={{fontSize:12,padding:"3px 0",color:"#444"}}>• {t}</div>)}
              </div>}
              {toArr(report.recommendation?.risk_warnings).length>0&&<div style={{background:"#fef3c7",borderRadius:8,padding:"10px 14px"}}>
                <div style={{fontWeight:600,fontSize:12,color:"#b45309",marginBottom:5}}>⚠ 注意事項</div>
                {toArr(report.recommendation?.risk_warnings).map((w,i)=><div key={i} style={{fontSize:12,color:"#b45309",padding:"2px 0"}}>• {w}</div>)}
              </div>}
            </div>
          </div>}

          {/* Decision Record */}
          <div style={{...S.card,borderLeft:"4px solid #1d4ed8",marginTop:4}}>
            <div style={S.ch}>
              <span style={{fontWeight:600}}>📝 例會決議記錄</span>
              {decisionSaved&&<span style={{...S.bdg("green"),fontSize:11}}>✓ 已儲存</span>}
            </div>
            <div style={S.cb}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={S.lbl}>決議廠商</label>
                  <select style={S.inp} value={decision.vendor} onChange={e=>setDecision(d=>({...d,vendor:e.target.value}))}>
                    <option value="">請選擇廠商</option>
                    {toArr(report.vendors).map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>議價後金額（含稅）</label>
                  <input style={S.inp} type="number" placeholder="例：120000" value={decision.amount} onChange={e=>setDecision(d=>({...d,amount:e.target.value}))}/>
                </div>
                <div>
                  <label style={S.lbl}>決議日期</label>
                  <input style={S.inp} type="date" value={decision.date} onChange={e=>setDecision(d=>({...d,date:e.target.value}))}/>
                </div>
                <div>
                  <label style={S.lbl}>下次追蹤日期</label>
                  <input style={S.inp} type="date" value={decision.followup} onChange={e=>setDecision(d=>({...d,followup:e.target.value}))}/>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={S.lbl}>決議原因（含系統相容性、廠商優勢等考量）</label>
                <textarea style={{...S.inp,height:72,resize:"vertical"}} placeholder="例：車辨系統已使用中保，考量系統相容性選擇同廠商" value={decision.reason} onChange={e=>setDecision(d=>({...d,reason:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button style={{...S.btnP,flex:1,justifyContent:"center"}} onClick={saveReport}>
                  💾 儲存比價報告＋決議記錄
                </button>
                <button style={{...S.btnG}} onClick={()=>setDecision({vendor:"",amount:"",reason:"",date:"",followup:""})}>
                  清除
                </button>
              </div>
              {decision.followup&&<div style={{marginTop:10,padding:"8px 12px",background:"#dbeafe",borderRadius:8,fontSize:12,color:"#1d4ed8"}}>
                🔔 追蹤提醒：{decision.followup} 記得跟進此案
              </div>}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default function App(){
  const [page, setPage] = useState("dashboard");
  const [records, setRecords] = useState([]);
  const [modal, setModal] = useState(null);
  const [iFiles, setIFiles] = useState([]);
  const [iStatus, setIStatus] = useState({});
  const [extracting, setExtracting] = useState(false);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");
  const [fType, setFType] = useState("");
  const [fUrg, setFUrg] = useState("");
  const [mForm, setMForm] = useState({title:"",date:"",equipment_type:"電梯",problem_description:"",selected_vendor:"",amount_total:"",urgency:"medium",warranty:"",location:""});
  const [costTab, setCostTab] = useState("all");

  useEffect(()=>{
    (async()=>{
      try{
        const res = await window.storage.get("records");
        const stored = res ? JSON.parse(res.value) : [];
        const ids = new Set(stored.map(r=>r.id));
        // Merge DEMO records, patch in new fields (negotiation_strategy etc) without overwriting user data
        const demoMap = Object.fromEntries(DEMO.map(d=>[d.id,d]));
        const NEW_FIELDS = ["negotiation_strategy","vendors","status"];
        const merged = [
          ...stored.map(r=>{
            if(!demoMap[r.id]) return r;
            const patch = {};
            NEW_FIELDS.forEach(f=>{ if(demoMap[r.id][f]!==undefined && r[f]===undefined) patch[f]=demoMap[r.id][f]; });
            return {...r,...patch};
          }),
          ...DEMO.filter(d=>!ids.has(d.id))
        ];
        // Remove stale/incorrect driveway records before merging
        const STALE_TITLES = ["車道出入口通道施作工程","車道出入口通道整修施工工程"];
        const cleanStored = stored.filter(r=>{
          if(STALE_TITLES.includes(r.title) && !r.compare_report) return false;
          if(r.selected_vendor && r.selected_vendor.length > 20) return false;
          return true;
        });
        // Force overwrite certain DEMO records to pick up new fields
        const FORCE_UPDATE_IDS = ["driveway1","gate1","gate_prev1","gate_prev2","aef_gate1"];
        const demoMap2 = Object.fromEntries(DEMO.map(d=>[d.id,d]));
        const patchedStored = cleanStored.map(r=>
          FORCE_UPDATE_IDS.includes(r.id) && demoMap2[r.id] ? {...demoMap2[r.id]} : r
        );
        const cleanIds = new Set(patchedStored.map(r=>r.id));

        // Auto dedup: keep unique by id first, then by title+date+vendor for duplicates
        const seenIds = new Set();
        const seenKeys = new Set();
        const deduped = [...patchedStored,...DEMO.filter(d=>!cleanIds.has(d.id))].filter(r=>{
          // Always keep records with stable DEMO ids
          if(r.id && r.id.match(/^(demo|import|gate|driveway|aef)/)){
            if(seenIds.has(r.id)) return false;
            seenIds.add(r.id); return true;
          }
          // Dedup dynamic records by title+date+vendor
          const key = (r.title||"")+(r.date||"")+(r.selected_vendor||"");
          if(seenKeys.has(key)) return false;
          seenKeys.add(key); return true;
        });
        await window.storage.set("records",JSON.stringify(deduped));
        setRecords(deduped);
      } catch{ setRecords(DEMO); }
    })();
  },[]);

  const save = useCallback(async recs=>{
    setRecords(recs);
    try{ await window.storage.set("records",JSON.stringify(recs)); } catch{}
  },[]);

  const navItems = [
    {id:"dashboard",icon:"📊",label:"總覽儀表板"},
    {id:"import",icon:"📥",label:"匯入文件"},
    {id:"records",icon:"📋",label:"修繕紀錄"},
    {id:"cost",icon:"💰",label:"費用統計"},
    {id:"vendors",icon:"🏪",label:"廠商分析"},
    {id:"compare",icon:"⚖️",label:"比價分析"},
    {id:"predict",icon:"🔮",label:"預測預警"},
    {id:"negotiate",icon:"🤝",label:"議價策略"},
  ];
  const titles = {dashboard:"總覽儀表板",import:"匯入文件",records:"修繕紀錄",cost:"費用統計",vendors:"廠商分析",compare:"比價分析",predict:"預測預警",negotiate:"議價策略"};

  const total = records.reduce((s,r)=>s+Number(r.amount_total||0),0);
  const ytd = records.filter(r=>rYear(r)===thisYear()).reduce((s,r)=>s+Number(r.amount_total||0),0);
  const types = [...new Set(records.map(r=>r.equipment_type).filter(Boolean))];
  const filtered = records.filter(r=>{
    const txt=(r.title+r.equipment_type+r.selected_vendor+(r.problem_description||"")).toLowerCase();
    return(!search||txt.includes(search.toLowerCase()))&&(!fType||r.equipment_type===fType)&&(!fUrg||r.urgency===fUrg);
  }).sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const addIFiles = fs=>{
    const v=[...fs].filter(f=>{const t=f.type.toLowerCase(),n=f.name.toLowerCase();return t.startsWith("image/")||t==="application/pdf"||n.endsWith(".jpg")||n.endsWith(".jpeg")||n.endsWith(".png")||n.endsWith(".pdf");});
    setIFiles(prev=>{const n=new Set(prev.map(x=>x.name));return[...prev,...v.filter(f=>!n.has(f.name))];});
  };

  const extractOne = async f => {
    const b64 = await toB64(f);
    const isPdf = f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf");
    const fileMsg = isPdf
      ? {type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}}
      : {type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}};
    const prompt = "你是台灣社區管委會文件分析師。從這份文件萃取修繕案件資訊，只回傳JSON不含markdown。欄位(找不到填null)：title,date(YYYY-MM-DD民國年+1911),equipment_type(電梯/消防系統/給排水/景觀綠化/門禁鐵捲門/停車場/公共照明/空調/病蟲害防治/其他),location,problem_description,solution,selected_vendor,amount_total(含稅數字),warranty(年數字),urgency(high/medium/low),tags(陣列)";
    const raw = await callClaude([{role:"user",content:[fileMsg,{type:"text",text:prompt}]}]);
    const s=raw.indexOf("{"),e=raw.lastIndexOf("}")+1;
    const p = JSON.parse(raw.slice(s,e));
    p.id = "r_"+Date.now()+"_"+Math.random().toString(36).slice(2);
    return p;
  };

  const startExtract = async()=>{
    setExtracting(true); setPending([]);
    const results=[];
    for(const f of iFiles){
      setIStatus(p=>({...p,[f.name]:"loading"}));
      try{
        const rec=await extractOne(f);
        results.push(rec);
        setIStatus(p=>({...p,[f.name]:"done"}));
        setPending([...results]);
      } catch{ setIStatus(p=>({...p,[f.name]:"error"})); }
    }
    setExtracting(false);
  };

  const exportCSV=()=>{
    const h=["日期","案件名稱","設備類型","地點","廠商","含稅金額","緊急程度","保固","問題描述"];
    const rows=records.map(r=>[r.date||"",r.title||"",r.equipment_type||"",r.location||"",r.selected_vendor||"",r.amount_total||"",r.urgency||"",r.warranty||0,(r.problem_description||"").split(",").join("，")]);
    const csv=[h,...rows].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv"}));a.download="水悅社區修繕紀錄.csv";a.click();
  };

  const rDashboard=()=>{
    const recent=[...records].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,5);
    const alerts=records.filter(r=>r.urgency==="high").slice(0,4);
    const tg=records.reduce((a,r)=>{if(r.equipment_type){a[r.equipment_type]=(a[r.equipment_type]||0)+1;}return a;},{});
    const yg=records.reduce((a,r)=>{const y=rYear(r);if(y){a[y]=(a[y]||0)+Number(r.amount_total||0);}return a;},{});
    return (
      <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        <SC label="修繕案件總數" value={records.length} sub={"含 "+records.filter(r=>r.urgency==="high").length+" 件緊急"}/>
        <SC label="歷史費用合計" value={fmt(total)} color="#2d6a4f"/>
        <SC label="本年度費用" value={fmt(ytd)} color="#b45309"/>
        <SC label="涉及廠商數" value={new Set(records.map(r=>r.selected_vendor).filter(Boolean)).size} sub="家廠商"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>費用趨勢</span></div><div style={S.cb}><BC data={Object.entries(yg).sort((a,b)=>a[0]-b[0]).map(([y,v])=>({l:y+"年",v,s:fmt(v)}))}/></div></div>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>設備分布</span></div><div style={S.cb}><BC data={Object.entries(tg).sort((a,b)=>b[1]-a[1]).map(([t,c],i)=>({l:t,v:c,s:c+"件",c:COLORS[i%COLORS.length]}))}/></div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>🔴 緊急案件</span><span style={S.bdg("red")}>{alerts.length}</span></div><div style={S.cb}>{alerts.length?alerts.map(r=><div key={r.id} style={{borderLeft:"4px solid #b91c1c",background:"#fee2e2",borderRadius:"0 8px 8px 0",padding:"10px 14px",marginBottom:8,cursor:"pointer"}} onClick={()=>openModal(r)}><div style={{fontWeight:600,fontSize:13}}>{r.title}</div><div style={{fontSize:12,color:"#888580"}}>{r.date} · {r.equipment_type}</div></div>):<p style={{color:"#888580",fontSize:13}}>目前無緊急案件 🎉</p>}</div></div>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>最近案件</span></div><div style={S.cb}>{recent.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #e2e0d8",cursor:"pointer"}} onClick={()=>openModal(r)}><div><div style={{fontSize:13,fontWeight:500}}>{r.title}</div><div style={{fontSize:12,color:"#888580"}}>{r.date} · {r.selected_vendor||"—"}</div></div><div style={{fontWeight:700,color:"#2d6a4f",fontSize:13}}>{fmt(r.amount_total)}</div></div>)}</div></div>
      </div>
      </div>

    );
  };

  const rImport=()=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
      <div>
        <div style={{border:"2px dashed #ccc9be",borderRadius:10,padding:36,textAlign:"center",cursor:"pointer",background:"#faf9f6",marginBottom:16}} onClick={()=>document.getElementById("fi").click()}>
          <input id="fi" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple style={{display:"none"}} onChange={e=>{if(e.target.files.length>0)addIFiles(e.target.files);e.target.value="";}}/>
          <div style={{fontSize:32,marginBottom:10}}>📄</div>
          <p style={{fontWeight:600,marginBottom:4}}>點擊選擇檔案</p>
          <p style={{fontSize:12,color:"#888580"}}>支援 PDF、JPG、PNG</p>
        </div>
        {iFiles.map(f=>{const st=iStatus[f.name];const ss=st==="loading"?{background:"#dbeafe",color:"#1d4ed8"}:st==="done"?{background:"#e8f4ef",color:"#1b4332"}:st==="error"?{background:"#fee2e2",color:"#b91c1c"}:{background:"#f1efea",color:"#888580"};return <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",border:"1px solid #e2e0d8",borderRadius:8,marginBottom:8,background:"#fff"}}><span>📄</span><span style={{flex:1,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span><span style={{...ss,borderRadius:20,padding:"2px 8px",fontSize:11}}>{st==="loading"?"分析中…":st==="done"?"完成":st==="error"?"失敗":"待處理"}</span></div>;})}
        <div style={{display:"flex",gap:10,marginTop:12}}>
          <button style={{...S.btnP,opacity:iFiles.length===0||extracting?.4:1}} disabled={iFiles.length===0||extracting} onClick={startExtract}>{extracting?"⏳ 分析中…":"⚡ AI 自動萃取"}</button>
          <button style={S.btnG} onClick={()=>{setIFiles([]);setIStatus({});setPending([]);}}>清除</button>
        </div>
        {pending.length>0&&<div style={{marginTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h3 style={{fontSize:14,fontWeight:600}}>萃取結果（請確認）</h3><button style={S.btnP} onClick={()=>{const n=[...records,...pending.filter(p=>!records.find(r=>r.id===p.id))];save(n);setIFiles([]);setIStatus({});setPending([]);setPage("records");}}>✓ 全部儲存</button></div>
          {pending.map((r,idx)=><div key={r.id} style={{...S.card,marginBottom:16}}>
            <div style={S.ch}><span style={{fontWeight:600,fontSize:13}}>{r.title||"未命名"}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><UBadge u={r.urgency}/><span style={{fontWeight:700,color:"#2d6a4f"}}>{fmt(r.amount_total)}</span></div></div>
            <div style={S.cb}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["日期","date"],["設備類型","equipment_type"],["廠商","selected_vendor"],["含稅金額","amount_total"],["保固年限","warranty"],["地點","location"]].map(([l,k])=><div key={k}><label style={S.lbl}>{l}</label><input style={S.inp} value={r[k]||""} onChange={e=>setPending(p=>p.map((x,i)=>i===idx?{...x,[k]:e.target.value}:x))}/></div>)}
            </div></div>
          </div>)}
        </div>}
      </div>
      <div style={S.card}>
        <div style={S.ch}><span style={{fontWeight:600}}>手動新增案件</span></div>
        <div style={S.cb}>
          {[["案件名稱 *","title","text"],["日期 *","date","date"],["施工地點","location","text"],["廠商","selected_vendor","text"],["含稅金額","amount_total","number"],["保固年限(年)","warranty","number"]].map(([l,k,t])=><div key={k} style={{marginBottom:12}}><label style={S.lbl}>{l}</label><input style={S.inp} type={t} value={mForm[k]||""} onChange={e=>setMForm(f=>({...f,[k]:e.target.value}))}/></div>)}
          <div style={{marginBottom:12}}><label style={S.lbl}>設備類型</label><select style={S.inp} value={mForm.equipment_type} onChange={e=>setMForm(f=>({...f,equipment_type:e.target.value}))}>{EQ_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div style={{marginBottom:12}}><label style={S.lbl}>緊急程度</label><select style={S.inp} value={mForm.urgency} onChange={e=>setMForm(f=>({...f,urgency:e.target.value}))}><option value="low">🟢 例行</option><option value="medium">🟡 一般</option><option value="high">🔴 緊急</option></select></div>
          <div style={{marginBottom:16}}><label style={S.lbl}>問題描述</label><textarea style={{...S.inp,height:64,resize:"vertical"}} value={mForm.problem_description} onChange={e=>setMForm(f=>({...f,problem_description:e.target.value}))}/></div>
          <button style={{...S.btnP,width:"100%",justifyContent:"center"}} onClick={()=>{if(!mForm.title){alert("請填寫案件名稱");return;}save([...records,{...mForm,id:"m_"+Date.now(),amount_total:Number(mForm.amount_total)||0,warranty:Number(mForm.warranty)||0,tags:[]}]);setMForm({title:"",date:"",equipment_type:"電梯",problem_description:"",selected_vendor:"",amount_total:"",urgency:"medium",warranty:"",location:""});setPage("records");}}>✓ 儲存案件</button>
        </div>
      </div>
    </div>
  );

  const rRecords=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input style={{...S.inp,width:240}} placeholder="搜尋名稱、設備、廠商…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <select style={{...S.inp,width:150}} value={fType} onChange={e=>setFType(e.target.value)}><option value="">所有設備類型</option>{types.map(t=><option key={t}>{t}</option>)}</select>
          <select style={{...S.inp,width:120}} value={fUrg} onChange={e=>setFUrg(e.target.value)}><option value="">所有緊急程度</option><option value="high">🔴 緊急</option><option value="medium">🟡 一般</option><option value="low">🟢 例行</option></select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,color:"#888580"}}>{filtered.length} 筆</span>
          <button style={{...S.btnG,fontSize:11,padding:"4px 10px",color:"#b91c1c",borderColor:"#fca5a5"}} onClick={()=>{
            const seen=new Set();
            const deduped=records.filter(r=>{
              const key=r.title+"|"+r.date+"|"+(r.selected_vendor||"");
              if(seen.has(key)) return false;
              seen.add(key); return true;
            });
            const dupCount=records.length-deduped.length;
            if(dupCount===0){alert("沒有重複的紀錄！");return;}
            if(window.confirm("發現 "+dupCount+" 筆重複紀錄，確定清除嗎？")){
              save(deduped);
            }
          }}>🧹 清除重複({records.length-[...new Set(records.map(r=>r.title+"|"+r.date+"|"+(r.selected_vendor||"")))].length}筆)</button>
        </div>
      </div>
      <div style={S.card}><div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["日期","案件名稱","設備類型","廠商","含稅金額","緊急程度","保固",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(r=><tr key={r.id} style={{cursor:"pointer"}} onClick={()=>openModal(r)}>
            <td style={{...S.td,fontFamily:"monospace",fontSize:12}}>{r.date||"—"}</td>
            <td style={{...S.td,fontWeight:600}}>{r.title||"—"}</td>
            <td style={S.td}>{r.equipment_type||"—"}</td>
            <td style={S.td}>{r.selected_vendor||"—"}</td>
            <td style={{...S.td,fontWeight:700,color:"#2d6a4f"}}>{fmt(r.amount_total)}</td>
            <td style={S.td}><UBadge u={r.urgency}/></td>
            <td style={S.td}>{r.warranty?r.warranty+"年":"—"}</td>
            <td style={S.td}><button style={S.btnG} onClick={e=>{e.stopPropagation();openModal(r);}}>詳情</button></td>
          </tr>)}</tbody>
        </table>
        {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:"#888580"}}><div style={{fontSize:36,marginBottom:12,opacity:.3}}>📋</div><p>尚無符合條件的紀錄</p></div>}
      </div></div>
    </div>
  );

  const rCost=()=>{
    const ct=records.reduce((s,r)=>s+Number(r.amount_total||0),0);
    const months=Array(12).fill(0);records.filter(r=>rYear(r)===thisYear()).forEach(r=>{if(r.date)months[rMonth(r)-1]+=Number(r.amount_total||0);});
    const byType=records.reduce((a,r)=>{if(r.equipment_type){a[r.equipment_type]=(a[r.equipment_type]||0)+Number(r.amount_total||0);}return a;},{});
    const mL=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
    const years=[...new Set(records.map(r=>rYear(r)).filter(Boolean))].sort();
    const showRecs=costTab==="all"?records:records.filter(r=>String(rYear(r))===costTab);
    return (
      <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        <SC label="歷史總費用" value={fmt(ct)} color="#2d6a4f"/>
        <SC label={thisYear()+"年費用"} value={fmt(ytd)} color="#b45309"/>
        <SC label="案件平均費用" value={fmt(records.length?Math.round(ct/records.length):0)}/>
        <SC label="案件總數" value={records.length}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>本年月份費用</span></div><div style={S.cb}><BC clr="#1d4ed8" data={months.map((v,i)=>({l:mL[i],v,s:v>0?fmt(v):""}))}/></div></div>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>設備類型費用排行</span></div><div style={S.cb}><BC data={Object.entries(byType).sort((a,b)=>b[1]-a[1]).map(([t,v],i)=>({l:t,v,s:fmt(v),c:COLORS[i%COLORS.length]}))}/></div></div>
      </div>
      <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>費用明細</span></div>
        <div style={{...S.cb,paddingBottom:0}}>
          <div style={{display:"flex",gap:4,borderBottom:"1px solid #e2e0d8",marginBottom:16}}>
            {["all",...years.map(String)].map(y=><div key={y} style={{padding:"7px 14px",fontSize:13,cursor:"pointer",borderBottom:`2px solid ${costTab===y?"#2d6a4f":"transparent"}`,color:costTab===y?"#2d6a4f":"#888580",marginBottom:-1}} onClick={()=>setCostTab(y)}>{y==="all"?"全部":y+"年"}</div>)}
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["日期","案件名稱","設備類型","廠商","含稅金額"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{[...showRecs].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(r=><tr key={r.id}><td style={{...S.td,fontFamily:"monospace",fontSize:12}}>{r.date||"—"}</td><td style={S.td}>{r.title}</td><td style={S.td}>{r.equipment_type||"—"}</td><td style={S.td}>{r.selected_vendor||"—"}</td><td style={{...S.td,fontWeight:700,color:"#2d6a4f"}}>{fmt(r.amount_total)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      </div>

    );
  };

  const rVendors=()=>{
    const byV=records.reduce((a,r)=>{if(!r.selected_vendor)return a;if(!a[r.selected_vendor])a[r.selected_vendor]={total:0,count:0,types:[]};a[r.selected_vendor].total+=Number(r.amount_total||0);a[r.selected_vendor].count++;if(r.equipment_type&&!a[r.selected_vendor].types.includes(r.equipment_type))a[r.selected_vendor].types.push(r.equipment_type);return a;},{});
    const sorted=Object.entries(byV).sort((a,b)=>b[1].total-a[1].total);
    return (
      <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>廠商費用排行</span></div><div style={S.cb}><BC data={sorted.map(([n,i],idx)=>({l:n.slice(0,8),v:i.total,s:fmt(i.total),r:i.count+"件",c:COLORS[idx%COLORS.length]}))}/></div></div>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>比價分析</span></div><div style={S.cb}>
          <div style={{borderLeft:"4px solid #2d6a4f",background:"#e8f4ef",borderRadius:"0 8px 8px 0",padding:"12px 16px",marginBottom:12}}><div style={{fontWeight:600,fontSize:13,marginBottom:4}}>⚖️ 使用比價分析功能</div><p style={{fontSize:12,color:"#888580"}}>前往「比價分析」頁面，上傳多家報價單，AI 自動分析規格差異與議價建議。</p></div>
          <div style={{borderLeft:"4px solid #b45309",background:"#fef3c7",borderRadius:"0 8px 8px 0",padding:"12px 16px"}}><div style={{fontWeight:600,fontSize:13,marginBottom:4}}>💡 議價建議</div><p style={{fontSize:12,color:"#888580"}}>同類工程建議至少比價 2 家，平均可議價降低 8-15%。</p></div>
        </div></div>
      </div>
      <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>廠商明細</span></div><div style={S.cb}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["廠商名稱","承接件數","總費用","平均單價","主要類型"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{sorted.map(([n,i])=><tr key={n}><td style={{...S.td,fontWeight:600}}>{n}</td><td style={S.td}>{i.count}件</td><td style={{...S.td,fontWeight:700,color:"#2d6a4f"}}>{fmt(i.total)}</td><td style={{...S.td,fontFamily:"monospace",fontSize:12}}>{fmt(Math.round(i.total/i.count))}</td><td style={{...S.td,fontSize:12,color:"#888580"}}>{i.types.join("、")||"—"}</td></tr>)}</tbody>
        </table>
      </div></div>
      </div>

    );
  };

  const rPredict=()=>{
    const byType=records.reduce((a,r)=>{if(!r.equipment_type)return a;if(!a[r.equipment_type])a[r.equipment_type]={count:0,total:0,high:0,lastDate:""};a[r.equipment_type].count++;a[r.equipment_type].total+=Number(r.amount_total||0);if(r.urgency==="high")a[r.equipment_type].high++;if((r.date||"")>a[r.equipment_type].lastDate)a[r.equipment_type].lastDate=r.date;return a;},{});
    const risks=Object.entries(byType).map(([type,i])=>{const days=i.lastDate?Math.round((Date.now()-new Date(i.lastDate))/864e5):999;const score=Math.min(100,Math.round(i.count*20+i.high*30+Math.max(0,60-days/3)));return{type,score,count:i.count,lastDate:i.lastDate,avg:Math.round(i.total/i.count)};}).sort((a,b)=>b.score-a.score);
    const rc=s=>s>=70?"#b91c1c":s>=40?"#b45309":"#2d6a4f";
    const now=new Date();
    const warranties=records.filter(r=>r.warranty>0&&r.date).map(r=>{const end=new Date(r.date);end.setFullYear(end.getFullYear()+Number(r.warranty));return{...r,we:end.toISOString().split("T")[0],dl:Math.round((end-now)/864e5)};}).sort((a,b)=>a.dl-b.dl);
    const yrs=[...new Set(records.map(r=>rYear(r)).filter(Boolean))];
    const annualAvg=yrs.length?Math.round(records.reduce((s,r)=>s+Number(r.amount_total||0),0)/yrs.length):0;
    return (
      <div>
      <div style={{...S.card,borderLeft:"4px solid #b45309",background:"#fef3c7",marginBottom:20}}><div style={S.cb}><span style={{fontWeight:600}}>🔔 Rich Lee 預測說明：</span><span style={{fontSize:13,color:"#888580"}}>根據歷史修繕頻率計算風險評分，資料越多越準確。Rich Lee 會幫你找出最需要注意的設備！</span></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>設備風險評分</span></div><div style={S.cb}>
          {risks.map(r=><div key={r.type} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:500}}>{r.type}</span><span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:rc(r.score)}}>{r.score}分</span></div>
            <div style={{height:8,background:"#f5f4f0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:r.score+"%",background:rc(r.score),borderRadius:4,transition:"width .6s"}}/></div>
            <div style={{fontSize:11,color:"#888580",marginTop:3}}>歷史 {r.count} 件 · 平均 {fmt(r.avg)} · 最近 {r.lastDate||"—"}</div>
          </div>)}
        </div></div>
        <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>保固到期提醒</span></div><div style={S.cb}>
          {warranties.length?warranties.map(r=>{const bd=r.dl<0?"#b91c1c":r.dl<180?"#b45309":"#2d6a4f";const bg=r.dl<0?"#fee2e2":r.dl<180?"#fef3c7":"#e8f4ef";const icon=r.dl<0?"🔴":r.dl<30?"🟠":r.dl<180?"🟡":"🟢";return <div key={r.id} style={{borderLeft:"4px solid "+bd,background:bg,borderRadius:"0 8px 8px 0",padding:"10px 14px",marginBottom:8}}><div style={{fontWeight:600,fontSize:13}}>{icon} {r.title}</div><div style={{fontSize:12,color:"#888580"}}>保固至 {r.we}（{r.dl<0?"已逾期 "+Math.abs(r.dl)+" 天":r.dl+" 天後到期"}）</div></div>;}): <p style={{color:"#888580",fontSize:13}}>暫無保固紀錄</p>}
        </div></div>
      </div>
      <div style={S.card}><div style={S.ch}><span style={{fontWeight:600}}>費用預估</span></div><div style={S.cb}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:16}}>
          <SC label="預估下年度費用" value={fmt(annualAvg)} color="#b45309" sub="依歷史年均值"/>
          <SC label="最高風險設備" value={risks[0]?.type||"—"} sub="建議優先編列預算"/>
          <SC label="近期保固到期" value={warranties.filter(w=>w.dl>=0&&w.dl<180).length+" 件"} sub="180天內"/>
        </div>
        <div style={{borderLeft:"4px solid #2d6a4f",background:"#e8f4ef",borderRadius:"0 8px 8px 0",padding:"12px 16px"}}><div style={{fontWeight:600,fontSize:13,marginBottom:4}}>📈 提升預測精準度</div><p style={{fontSize:12,color:"#888580"}}>目前共 {records.length} 筆。建議將過去 2-3 年工單全部匯入，系統將自動分析故障週期。</p></div>
      </div></div>
      </div>

    );
  };

  // Enrich record with DEMO fields when opening modal
  const openModal = (r) => {
    const demoRecord = DEMO.find(d=>d.id===r.id);
    if(demoRecord) {
      const enriched = {...r};
      ["negotiation_strategy","vendors","status"].forEach(f=>{
        if(enriched[f]===undefined && demoRecord[f]!==undefined) enriched[f]=demoRecord[f];
      });
      setModal(enriched);
    } else {
      setModal(r);
    }
  };

  const rNegotiate=()=>(
    <div>
      <div style={{...S.card,borderLeft:"4px solid #1d4ed8",background:"#dbeafe",marginBottom:20}}>
        <div style={S.cb}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{background:"#1d4ed8",color:"#fff",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤖</div>
            <div><div style={{fontWeight:700,fontSize:14,color:"#1d4ed8"}}>Rich Lee｜修繕採購 AI 顧問</div><div style={{fontSize:11,color:"#888580"}}>幫社區省錢才是真正的富有</div></div>
          </div>
          <p style={{fontSize:13,color:"#444"}}>每個案件的議價策略與注意事項，供新手委員開例會前參考。有 Rich Lee 在，議價不再靠感覺！</p>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.ch}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>🚗 車道出入口通道施作工程</div>
            <div style={{fontSize:12,color:"#888580",marginTop:2}}>決議廠商：譽展　｜　含稅金額：$178,605　｜　施工日期：2026-04-27　｜　已完工</div>
          </div>
          <span style={{...S.bdg("green")}}>已完工</span>
        </div>
        <div style={S.cb}>
          <div style={{marginBottom:14,background:"#fef3c7",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#b45309",marginBottom:4}}>💡 本案決議採柏油工法（譽展，$178,605含稅，2026-04-27完工）</div>
            <p style={{fontSize:13,color:"#444",lineHeight:1.7,margin:0}}>本次採柏油施工，費用較低、工期短。但車道長期使用下，RC壓花耐用性明顯較佳，建議下次重鋪時優先考慮RC壓花工法。</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div style={{border:"2px solid #2d6a4f",borderRadius:8,padding:"14px",background:"#e8f4ef"}}>
              <div style={{fontWeight:700,fontSize:14,color:"#1b4332",marginBottom:10}}>✅ RC壓花地坪（推薦）</div>
              {[
                "耐用年限20-30年，柏油僅5-8年",
                "混凝土承重強，重覆碾壓不變形",
                "不受高溫影響，夏天不軟化泛油",
                "表面壓花紋路，雨天防滑性佳",
                "轉彎煞車側向力大，RC不易位移",
                "長期維護成本遠低於柏油"
              ].map((s,i)=><div key={i} style={{fontSize:12,color:"#1b4332",padding:"3px 0"}}>• {s}</div>)}
            </div>
            <div style={{border:"1px solid #e2e0d8",borderRadius:8,padding:"14px",background:"#faf9f6"}}>
              <div style={{fontWeight:700,fontSize:14,color:"#888580",marginBottom:10}}>⚠ 柏油鋪設（需注意）</div>
              {[
                "施工費用較低、工期短",
                "台灣夏天高溫易軟化、出現轍痕",
                "5-8年需重鋪，費用持續累積",
                "轉彎煞車頻繁處容易磨損位移",
                "局部破損修補容易（優點）",
                "震動吸收較好、噪音略低（優點）"
              ].map((s,i)=><div key={i} style={{fontSize:12,color:"#888580",padding:"3px 0"}}>• {s}</div>)}
            </div>
          </div>

          <div style={{background:"#dbeafe",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#1d4ed8",marginBottom:6}}>📅 未來重鋪建議</div>
            <p style={{fontSize:13,color:"#444",lineHeight:1.7,margin:0}}>
              若本次決議柏油施工，建議在施工合約中要求廠商提供保固年限。
              預計5-8年後需重新評估，屆時優先考慮RC壓花工法，一次到位避免反覆施工。
              RC壓花雖然初期費用較高，但20-30年耐用期攤下來，年均成本反而更低。
            </p>
          </div>
        </div>
      </div>

      <div style={{marginTop:20}}></div>

      <div style={S.card}>
        <div style={S.ch}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>🚪 AEF棟大門修繕案</div>
            <div style={{fontSize:12,color:"#888580",marginTop:2}}>目前1家報價（東昱）｜待取得第二家比價｜東昱有兩筆歷史施工紀錄</div>
          </div>
          <span style={{...S.bdg("red")}}>待比價</span>
        </div>
        <div style={S.cb}>
          <div style={{background:"#fef3c7",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:13,color:"#b45309",marginBottom:6}}>📋 東昱歷史施工紀錄</div>
            {[
              "A.E.大門門扇上臂調整固定 → $7,350（2026-05-15）",
              "A.E.F棟地鉸鏈+門扇上臂更換(DORMA BTS-80) → $66,150（2026-05-15）"
            ].map((s,i)=><div key={i} style={{fontSize:12,color:"#444",padding:"3px 0"}}>• {s}</div>)}
            <div style={{marginTop:8,fontSize:12,color:"#b45309",fontWeight:500}}>
              ⚠ 東昱熟悉社區大門規格，但正因如此更要比價，避免因熟悉而報高價。
            </div>
          </div>

          <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>📋 議價步驟</div>
          {[
            {step:"第一步", title:"先取得第二家報價", color:"#1d4ed8", bg:"#dbeafe",
             content:"找另一家熟悉DORMA或同等級品牌的廠商，要求提供相同規格的報價單。有了比較基準，才有議價籌碼。"},
            {step:"第二步", title:"強調長期合作關係", color:"#2d6a4f", bg:"#e8f4ef",
             content:"告知東昱：社區已有兩筆合作紀錄，若報價合理願意繼續合作。以長期合作換取更好的價格條件，而非單純殺價。"},
            {step:"第三步", title:"拿第二家報價談判", color:"#b45309", bg:"#fef3c7",
             content:"若第二家報價明顯較低，直接告知東昱：我們有收到其他廠商報價，希望東昱重新考慮。不需說出對方金額，讓東昱自己調整。"},
            {step:"第四步", title:"確認施工規格一致", color:"#6d28d9", bg:"#ede9fe",
             content:"確認材料品牌（DORMA或同等級）、施工工法、保固年限是否與歷史施工一致。避免廠商用低規格材料報低價。"}
          ].map((s,i)=>(
            <div key={i} style={{borderLeft:"4px solid "+s.color,background:s.bg,borderRadius:"0 8px 8px 0",padding:"12px 16px",marginBottom:10}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <span style={{background:s.color,color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{s.step}</span>
                <span style={{fontWeight:600,fontSize:13}}>{s.title}</span>
              </div>
              <p style={{fontSize:13,color:"#444",lineHeight:1.7,margin:0}}>{s.content}</p>
            </div>
          ))}

          <div style={{background:"#e8f4ef",borderRadius:8,padding:"12px 14px",marginTop:4}}>
            <div style={{fontWeight:600,fontSize:13,color:"#1b4332",marginBottom:6}}>🎯 議價心法</div>
            <p style={{fontSize:13,color:"#444",lineHeight:1.7,margin:0}}>
              本案屬於設施維護性質，東昱已了解現場狀況是優勢。議價時態度友善，強調社區長期合作意願，
              目標是在合理價格內完成，而非追求最低價犧牲品質。取得第二家報價後上傳系統跑AI比價分析，讓數字說話。
            </p>
          </div>
        </div>
      </div>

      <div style={{marginTop:20}}></div>

      <div style={S.card}>
        <div style={S.ch}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>🚧 車道柵欄更新工程</div>
            <div style={{fontSize:12,color:"#888580",marginTop:2}}>決議廠商：中興保全(SECOM)　｜　目前報價：$145,530　｜　目標議價：$110,000～$120,000</div>
          </div>
          <span style={{...S.bdg("amber")}}>待議價</span>
        </div>
        <div style={S.cb}>
          <div style={{marginBottom:16}}>
            <div style={{fontWeight:600,fontSize:13,color:"#b45309",marginBottom:10}}>💡 為什麼選中保？</div>
            <div style={{background:"#f5f4f0",borderRadius:8,padding:"10px 14px",fontSize:13,lineHeight:1.8}}>
              社區車辨系統已使用中保，考量系統相容性避免跨品牌整合問題，雖然報價最高，但售後服務完整且淡水在地服務，長期維護成本較低。
            </div>
          </div>

          <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>📋 四步驟議價流程</div>
          {[
            {step:"第一步", title:"先要求說明，不要直接殺價", color:"#1d4ed8", bg:"#dbeafe",
             content:"詢問：NB-35FD與其他廠商NB-350規格差異為何？感應線圈為何需要4組而非標準2組？讓中保解釋，若說不清楚自然有降價空間。"},
            {step:"第二步", title:"拿數字說話", color:"#2d6a4f", bg:"#e8f4ef",
             content:"告知已收5家報價：鎧成$93,450、JGNet$95,000、巨璣$119,700、翎峰$138,600。中保$145,530差距超過5萬，希望重新檢視報價。"},
            {step:"第三步", title:"針對高價項目議價", color:"#b45309", bg:"#fef3c7",
             content:"安裝工資$42,000（2組x$21,000）明顯偏高，其他廠商約$10,000。要求降至$15,000-$18,000，可省約$24,000。感應線圈若堅持4組必要，需提供書面說明。"},
            {step:"第四步", title:"加碼條件代替殺價", color:"#6d28d9", bg:"#ede9fe",
             content:"若中保不願大幅降價，改談加值條件：保固從1年延長至2年、免費第一年定期保養2次、感應線圈地面切割回填費用含在報價內。"}
          ].map((s,i)=>(
            <div key={i} style={{borderLeft:"4px solid "+s.color,background:s.bg,borderRadius:"0 8px 8px 0",padding:"12px 16px",marginBottom:10}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <span style={{background:s.color,color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{s.step}</span>
                <span style={{fontWeight:600,fontSize:13}}>{s.title}</span>
              </div>
              <p style={{fontSize:13,color:"#444",lineHeight:1.7,margin:0}}>{s.content}</p>
            </div>
          ))}

          <div style={{marginTop:16}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>❓ 開會前建議先問中保這幾個問題</div>
            {[
              "NB-35FD與NB-350功能差異為何？可提供規格比較表嗎？",
              "感應線圈為何需要4組而非標準2組？超出部分的用途為何？",
              "安裝工資每組$21,000的計算依據為何？包含哪些工項？",
              "地面切割及回填費用是否已含在報價內？若無，另計多少？",
              "NB-35FD零件供應年限為何？停產後如何處理？"
            ].map((q,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"8px 12px",background:"#f5f4f0",borderRadius:7,marginBottom:6,fontSize:13}}>
                <span style={{color:"#1d4ed8",fontWeight:700,flexShrink:0}}>Q{i+1}.</span>
                <span style={{color:"#444"}}>{q}</span>
              </div>
            ))}
          </div>

          <div style={{marginTop:16,background:"#e8f4ef",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#1b4332",marginBottom:6}}>🤝 議價心法</div>
            <p style={{fontSize:13,color:"#444",lineHeight:1.8,margin:0}}>
              中保品牌售後服務完整、淡水在地服務是優勢，議價時保持友善但堅定的態度。
              強調社區長期合作關係，讓中保主動調整而非強迫降價。
              若中保調整至$120,000以下且加碼保固2年，即可視為議價成功。
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage=()=>{
    if(page==="dashboard") return rDashboard();
    if(page==="import") return rImport();
    if(page==="records") return rRecords();
    if(page==="cost") return rCost();
    if(page==="vendors") return rVendors();
    if(page==="compare") return <PageCompare records={records} save={save}/>;
    if(page==="predict") return rPredict();
    if(page==="negotiate") return rNegotiate();
    return null;
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"system-ui,sans-serif",fontSize:14,color:"#1a1916"}}>
      <aside style={S.sidebar}>
        <div style={{padding:"22px 20px 18px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{color:"rgba(255,255,255,.45)",fontSize:11,letterSpacing:1,marginBottom:4}}>宏盛水悅社區</div>
          <div style={{color:"#fff",fontSize:15,fontWeight:700,lineHeight:1.3}}>公設修繕<br/>管理系統</div>
          <div style={{color:"rgba(255,255,255,.35)",fontSize:11,marginTop:4,fontFamily:"monospace"}}>v1.0 管委會版</div>
          <div style={{marginTop:8,borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:8}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:10,marginBottom:6,letterSpacing:1}}>AI 數位管理團隊</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:12}}>🤖</span>
              <div>
                <div style={{color:"#52b788",fontSize:11,fontWeight:600}}>Rich Lee</div>
                <div style={{color:"rgba(255,255,255,.3)",fontSize:10}}>修繕採購顧問</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12}}>🤖</span>
              <div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:11,fontWeight:600}}>Terry Wang</div>
                <div style={{color:"rgba(255,255,255,.3)",fontSize:10}}>通報系統顧問</div>
              </div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 0"}}>
          <div style={{padding:"14px 16px 5px",fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:2}}>主要功能</div>
          {navItems.slice(0,3).map(n=><div key={n.id} style={S.ni(page===n.id)} onClick={()=>setPage(n.id)}><span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span><span>{n.label}</span></div>)}
          <div style={{padding:"14px 16px 5px",fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:2}}>分析</div>
          {navItems.slice(3).map(n=><div key={n.id} style={S.ni(page===n.id)} onClick={()=>setPage(n.id)}><span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span><span>{n.label}</span></div>)}
        </nav>
        <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,.1)"}}><div style={{color:"rgba(255,255,255,.3)",fontSize:11,fontFamily:"monospace"}}>{records.length} 筆紀錄</div></div>
      </aside>
      <main style={S.main}>
        <div style={S.topbar}>
          <span style={{fontWeight:600,fontSize:15}}>{titles[page]}</span>
          <div style={{display:"flex",gap:10}}>
            <button style={S.btnG} onClick={exportCSV}>⬇ 匯出 CSV</button>
            <button style={S.btnP} onClick={()=>setPage("import")}>＋ 新增案件</button>
          </div>
        </div>
        <div style={S.content}>{renderPage()}</div>
      </main>
      {modal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(null)}>
        <div style={{background:"#fff",borderRadius:14,width:560,maxWidth:"90vw",maxHeight:"85vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0,0,0,.15)"}} onClick={e=>e.stopPropagation()}>
          <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e0d8",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,fontSize:15}}>{modal.title}</span><button style={S.btnG} onClick={()=>setModal(null)}>✕</button></div>
          <div style={{padding:22}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[["報價/決議日期",modal.date],["設備類型",modal.equipment_type],["施工地點",modal.location],["廠商",modal.selected_vendor],["含稅金額",fmt(modal.amount_total)],["保固年限",modal.warranty?modal.warranty+"年":"—"],["施工日期",modal.construction_date||"—"],["完工狀態",modal.completion_status||"—"]].map(([l,v])=><div key={l}><div style={S.lbl}>{l}</div><div style={{fontWeight:500}}>{v||"—"}</div></div>)}
              <div style={{gridColumn:"span 2"}}><div style={S.lbl}>問題描述</div><div style={{fontSize:13,lineHeight:1.7}}>{modal.problem_description||"—"}</div></div>
              <div style={{gridColumn:"span 2"}}><div style={S.lbl}>解決方案</div><div style={{fontSize:13,lineHeight:1.7}}>{modal.solution||"—"}</div></div>
            </div>
            <div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:6}}><UBadge u={modal.urgency}/>{toArr(modal.tags).map(t=><span key={t} style={S.bdg("gray")}>{t}</span>)}</div>

            {/* Decision record */}
            {modal.decision&&modal.decision.vendor&&<div style={{marginTop:16,background:"#dbeafe",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontWeight:600,fontSize:13,color:"#1d4ed8",marginBottom:8}}>📝 例會決議記錄</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                <div><span style={{color:"#888580"}}>決議廠商：</span><span style={{fontWeight:600}}>{modal.decision.vendor}</span></div>
                <div><span style={{color:"#888580"}}>議價後金額：</span><span style={{fontWeight:600,color:"#2d6a4f"}}>{modal.decision.amount?"$"+Number(modal.decision.amount).toLocaleString():"待確認"}</span></div>
                <div><span style={{color:"#888580"}}>決議日期：</span>{modal.decision.date||"—"}</div>
                <div><span style={{color:"#888580"}}>追蹤日期：</span>{modal.decision.followup||"—"}</div>
                {modal.decision.reason&&<div style={{gridColumn:"span 2"}}><span style={{color:"#888580"}}>決議原因：</span>{modal.decision.reason}</div>}
              </div>
            </div>}

            {/* Negotiation strategy */}
            {modal.negotiation_strategy&&<div style={{marginTop:16}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#1a1916"}}>💰 議價策略參考（新手委員必讀）</div>
              <div style={{background:"#fef3c7",borderRadius:8,padding:"12px 14px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontWeight:600,fontSize:12,color:"#b45309"}}>🎯 目標議價金額</span>
                  <span style={{fontWeight:700,fontSize:15,color:"#b45309"}}>{modal.negotiation_strategy.target_price}</span>
                </div>
              </div>
              <div style={{marginBottom:10}}>
                {toArr(modal.negotiation_strategy?.steps).map((s,i)=><div key={i} style={{background:"#f5f4f0",borderRadius:8,padding:"10px 12px",marginBottom:8,fontSize:12,lineHeight:1.7,borderLeft:"3px solid #2d6a4f"}}>
                  {s}
                </div>)}
              </div>
              <div style={{background:"#dbeafe",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                <div style={{fontWeight:600,fontSize:12,color:"#1d4ed8",marginBottom:6}}>❓ 建議發問的問題</div>
                {toArr(modal.negotiation_strategy?.key_questions).map((q,i)=><div key={i} style={{fontSize:12,color:"#1d4ed8",padding:"2px 0"}}>• {q}</div>)}
              </div>
              {modal.negotiation_strategy.notes&&<div style={{background:"#e8f4ef",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#1b4332",lineHeight:1.7}}>
                💡 {modal.negotiation_strategy.notes}
              </div>}
            </div>}

            {/* Compare report */}
            {modal.compare_report&&<div style={{marginTop:16}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#1a1916"}}>⚖️ 比價分析詳情</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:12}}>
                {toArr(modal.compare_report?.vendors).map((v,i)=>{
                  const isTop=v.name===modal.compare_report.recommendation?.top_pick;
                  const sc=s=>s>=8?"#2d6a4f":s>=6?"#b45309":"#b91c1c";
                  return <div key={i} style={{border:isTop?"2px solid #2d6a4f":"1px solid #e2e0d8",borderRadius:8,padding:"10px 12px",background:isTop?"#e8f4ef":"#faf9f6",position:"relative"}}>
                    {isTop&&<div style={{position:"absolute",top:-8,right:8,background:"#2d6a4f",color:"#fff",fontSize:9,padding:"1px 7px",borderRadius:20}}>⭐ 推薦</div>}
                    <div style={{fontWeight:600,fontSize:12,marginBottom:4}}>{v.name}</div>
                    <div style={{fontWeight:700,color:"#2d6a4f",fontSize:13,marginBottom:6}}>${Number(v.amount||0).toLocaleString()}</div>
                    <div style={{display:"flex",gap:6,marginBottom:6}}>
                      <span style={{background:"#f5f4f0",borderRadius:4,padding:"2px 6px",fontSize:10}}>規格 <b style={{color:sc(v.spec_score)}}>{v.spec_score}</b></span>
                      <span style={{background:"#f5f4f0",borderRadius:4,padding:"2px 6px",fontSize:10}}>性價比 <b style={{color:sc(v.value_score)}}>{v.value_score}</b></span>
                    </div>
                    {toArr(v.strengths).slice(0,2).map((s,j)=><div key={j} style={{fontSize:11,color:"#2d6a4f"}}>✓ {s}</div>)}
                    {toArr(v.weaknesses).slice(0,2).map((s,j)=><div key={j} style={{fontSize:11,color:"#b91c1c"}}>⚠ {s}</div>)}
                  </div>;
                })}
              </div>
              {modal.compare_report.recommendation&&<div style={{background:"#e8f4ef",borderRadius:8,padding:"12px 14px",fontSize:12}}>
                <div style={{fontWeight:600,marginBottom:6,color:"#1b4332"}}>🎯 AI建議：{modal.compare_report.recommendation.top_pick}</div>
                <p style={{color:"#444",lineHeight:1.7,marginBottom:8}}>{modal.compare_report.recommendation.reason}</p>
                {(modal.compare_report.recommendation.negotiation_tips||[]).map((t,i)=><div key={i} style={{color:"#2d6a4f"}}>• {t}</div>)}
              </div>}
            </div>}
          </div>
          <div style={{padding:"14px 22px",borderTop:"1px solid #e2e0d8",display:"flex",justifyContent:"space-between"}}>
            <button style={S.btnD} onClick={()=>{if(window.confirm("確定刪除？")){save(records.filter(r=>r.id!==modal.id));setModal(null);}}}>刪除</button>
            <button style={S.btnG} onClick={()=>setModal(null)}>關閉</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
