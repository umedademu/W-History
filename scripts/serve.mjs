import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=fileURLToPath(new URL("../public/",import.meta.url));
const port=Number(process.env.PORT||8766);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".json":"application/json; charset=utf-8",".webp":"image/webp"};
const server=http.createServer(async(req,res)=>{
  if(!["GET","HEAD"].includes(req.method)){res.writeHead(405,{Allow:"GET, HEAD"});res.end();return;}
  let file;
  try{const name=decodeURIComponent(new URL(req.url,"http://localhost").pathname);file=path.resolve(root,`.${name==="/"?"/index.html":name}`);}catch{res.writeHead(400);res.end();return;}
  if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
  let body,status=200;
  try{body=await fs.readFile(file);}catch{status=404;file=path.join(root,"404.html");body=await fs.readFile(file);}
  res.writeHead(status,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(req.method==="HEAD"?undefined:body);
});
server.listen(port,"127.0.0.1",()=>console.log(`W-History: http://127.0.0.1:${port}`));
