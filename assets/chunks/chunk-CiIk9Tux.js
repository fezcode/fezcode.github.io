import{_ as f,G as u,K as B,d as C,l as w,b as S,a as D,p as T,q as z,g as E,s as P,H as F,E as A,z as W}from"./chunk-CBYGZBPk.js";import{p as _}from"./chunk-CQT9Iaz2.js";import{p as N}from"./chunk-mlHuRMOL.js";import"../entries/pages.BWQb9Xz5.js";/* empty css              *//* empty css              */import"./chunk-BXl3LOEh.js";/* empty css              */import"./chunk-6M3ol15h.js";import"./chunk-DrXJVHvy.js";import"./chunk-C24lB43w.js";import"./chunk-Zr3B5jDr.js";import"./chunk-DZOcISe9.js";import"./chunk-B5D8JARp.js";import"./chunk-vdpUE_up.js";import"./chunk-DuFClJln.js";import"./chunk-D856Hk-p.js";import"./chunk-D60KGupL.js";import"./chunk-CEnbQ19A.js";import"./chunk-DRh9FBAZ.js";import"./chunk-C5q4Xd34.js";var L=F.packet,b,v=(b=class{constructor(){this.packet=[],this.setAccTitle=S,this.getAccTitle=D,this.setDiagramTitle=T,this.getDiagramTitle=z,this.getAccDescription=E,this.setAccDescription=P}getConfig(){const t=u({...L,...A().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){W(),this.packet=[]}},f(b,"PacketDB"),b),M=1e4,Y=f((e,t)=>{_(e,t);let r=-1,o=[],n=1;const{bitsPerRow:l}=t.getConfig();for(let{start:a,end:s,bits:p,label:c}of e.blocks){if(a!==void 0&&s!==void 0&&s<a)throw new Error(`Packet block ${a} - ${s} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${s??a} is not contiguous. It should start from ${r+1}.`);if(p===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(s??=a+(p??1)-1,p??=s-a+1,r=s,w.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=l+1&&t.getPacket().length<M;){const[d,i]=G({start:a,end:s,bits:p,label:c},n,l);if(o.push(d),d.end+1===n*l&&(t.pushWord(o),o=[],n++),!i)break;({start:a,end:s,bits:p,label:c}=i)}}t.pushWord(o)},"populate"),G=f((e,t,r)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*r)return[e,void 0];const o=t*r-1,n=t*r;return[{start:e.start,end:o,label:e.label,bits:o-e.start},{start:n,end:e.end,label:e.label,bits:e.end-n}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:f(async e=>{const t=await N("packet",e),r=x.parser?.yy;if(!(r instanceof v))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(t),Y(t,r)},"parse")},H=f((e,t,r,o)=>{const n=o.db,l=n.getConfig(),{rowHeight:a,paddingY:s,bitWidth:p,bitsPerRow:c}=l,d=n.getPacket(),i=n.getDiagramTitle(),h=a+s,g=h*(d.length+1)-(i?0:a),m=p*c+2,k=B(t);k.attr("viewBox",`0 0 ${m} ${g}`),C(k,g,m,l.useMaxWidth);for(const[y,$]of d.entries())I(k,$,y,l);k.append("text").text(i).attr("x",m/2).attr("y",g-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),I=f((e,t,r,{rowHeight:o,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:s,showBits:p})=>{const c=e.append("g"),d=r*(o+l)+l;for(const i of t){const h=i.start%s*a+1,g=(i.end-i.start+1)*a-n;if(c.append("rect").attr("x",h).attr("y",d).attr("width",g).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",h+g/2).attr("y",d+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!p)continue;const m=i.end===i.start,k=d-2;c.append("text").attr("x",h+(m?g/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",m?"middle":"start").text(i.start),m||c.append("text").attr("x",h+g).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),K={draw:H},O={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},j=f(({packet:e}={})=>{const t=u(O,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),ht={parser:x,get db(){return new v},renderer:K,styles:j};export{ht as diagram};
