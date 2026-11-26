// Daylight colour field, adapted from fezcode.studio/landing/kit/fz-art.js.
export const studioFlowFragment = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float boost;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 p=uv; p.x*=r.x/r.y;
  float tt=t*.045;
  vec2 q=vec2(fbm(p*1.25+tt),fbm(p*1.25+vec2(5.2,1.3)-tt));
  vec2 w=vec2(fbm(p*1.1+2.6*q+vec2(1.7,9.2)+tt*.8),fbm(p*1.1+2.6*q+vec2(8.3,2.8)-tt*.6));
  float f=fbm(p*.9+2.8*w+(m-.5)*.5);
  vec3 c=mix(c0,c1,smoothstep(.25,.7,f));
  c=mix(c,c2,smoothstep(.38,.82,w.x)*.9);
  c=mix(c,c3,smoothstep(.5,.9,q.y*w.y*2.4+boost*.25)*(.5+boost*.45));
  c+=(hash(gl_FragCoord.xy+fract(t))-.5)*.03;
  gl_FragColor=vec4(c,1.);
}`;
