namespace L2G {
  class IncrementalSha256 {
    private h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    private buffer = new Uint8Array(64); private bufferLength = 0; private bytesHashed = 0; private finished = false;
    private static readonly K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
    update(data: Uint8Array): this {
      if (this.finished) throw new Error("SHA-256 instance is finalized."); this.bytesHashed += data.length; let position = 0;
      while (position < data.length) {
        const take = Math.min(data.length - position, 64 - this.bufferLength); this.buffer.set(data.subarray(position, position + take), this.bufferLength); this.bufferLength += take; position += take;
        if (this.bufferLength === 64) { this.process(this.buffer); this.bufferLength = 0; }
      }
      return this;
    }
    digestHex(): string {
      if (!this.finished) {
        const bitLengthHi = Math.floor(this.bytesHashed / 0x20000000); const bitLengthLo = (this.bytesHashed << 3) >>> 0;
        this.buffer[this.bufferLength++] = 0x80;
        if (this.bufferLength > 56) { this.buffer.fill(0, this.bufferLength); this.process(this.buffer); this.bufferLength = 0; }
        this.buffer.fill(0, this.bufferLength, 56);
        this.buffer[56] = (bitLengthHi >>> 24) & 255; this.buffer[57] = (bitLengthHi >>> 16) & 255; this.buffer[58] = (bitLengthHi >>> 8) & 255; this.buffer[59] = bitLengthHi & 255;
        this.buffer[60] = (bitLengthLo >>> 24) & 255; this.buffer[61] = (bitLengthLo >>> 16) & 255; this.buffer[62] = (bitLengthLo >>> 8) & 255; this.buffer[63] = bitLengthLo & 255;
        this.process(this.buffer); this.finished = true;
      }
      return Array.from(this.h).map(value => value.toString(16).padStart(8,"0")).join("");
    }
    private process(chunk: Uint8Array): void {
      const w = new Uint32Array(64);
      for (let i=0;i<16;i++) { const j=i*4; w[i]=((chunk[j]!<<24)|(chunk[j+1]!<<16)|(chunk[j+2]!<<8)|chunk[j+3]!)>>>0; }
      for (let i=16;i<64;i++) { const x=w[i-15]!; const y=w[i-2]!; const s0=(this.rotr(x,7)^this.rotr(x,18)^(x>>>3))>>>0; const s1=(this.rotr(y,17)^this.rotr(y,19)^(y>>>10))>>>0; w[i]=(w[i-16]!+s0+w[i-7]!+s1)>>>0; }
      let a=this.h[0]!,b=this.h[1]!,c=this.h[2]!,d=this.h[3]!,e=this.h[4]!,f=this.h[5]!,g=this.h[6]!,h=this.h[7]!;
      for (let i=0;i<64;i++) { const s1=(this.rotr(e,6)^this.rotr(e,11)^this.rotr(e,25))>>>0; const ch=((e&f)^((~e)&g))>>>0; const t1=(h+s1+ch+IncrementalSha256.K[i]!+w[i]!)>>>0; const s0=(this.rotr(a,2)^this.rotr(a,13)^this.rotr(a,22))>>>0; const maj=((a&b)^(a&c)^(b&c))>>>0; const t2=(s0+maj)>>>0; h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0; }
      this.h[0]=(this.h[0]!+a)>>>0;this.h[1]=(this.h[1]!+b)>>>0;this.h[2]=(this.h[2]!+c)>>>0;this.h[3]=(this.h[3]!+d)>>>0;this.h[4]=(this.h[4]!+e)>>>0;this.h[5]=(this.h[5]!+f)>>>0;this.h[6]=(this.h[6]!+g)>>>0;this.h[7]=(this.h[7]!+h)>>>0;
    }
    private rotr(value: number, bits: number): number { return (value >>> bits) | (value << (32-bits)); }
  }

  export function hashBytesInChunksForTest(bytes: Uint8Array, chunkSize: number): string {
    if (!Number.isSafeInteger(chunkSize) || chunkSize < 1) throw new Error("Chunk size is invalid."); const hash = new IncrementalSha256();
    for (let offset=0;offset<bytes.length;offset+=chunkSize) hash.update(bytes.subarray(offset,Math.min(bytes.length,offset+chunkSize))); return hash.digestHex();
  }

  export function hashEvidenceFile(file: File, onProgress: (completed: number,total: number) => void, signal?: AbortSignal): Promise<string> {
    if (file.size > 2147483648) return Promise.reject(new Error("The selected source exceeds the 2 GiB v0.4 limit."));
    const workerBody = `const Sha256=${IncrementalSha256.toString()};self.onmessage=async(e)=>{const{id,file,chunkSize}=e.data;try{const h=new Sha256();let offset=0;self.postMessage({id,type:'progress',completed:0,total:file.size});while(offset<file.size){const end=Math.min(file.size,offset+chunkSize);const bytes=new Uint8Array(await file.slice(offset,end).arrayBuffer());h.update(bytes);offset=end;self.postMessage({id,type:'progress',completed:offset,total:file.size});}self.postMessage({id,type:'done',sha256:h.digestHex()});}catch(error){self.postMessage({id,type:'error',message:error instanceof Error?error.message:String(error)});}};`;
    const url = URL.createObjectURL(new Blob([workerBody],{type:"text/javascript"})); const worker = new Worker(url); const id = newId("hash");
    return new Promise((resolve,reject) => {
      let settled=false;
      const finish=(error?:Error,value?:string):void=>{if(settled)return;settled=true;worker.terminate();URL.revokeObjectURL(url);signal?.removeEventListener("abort",abort);error?reject(error):resolve(value!);};
      const abort=():void=>finish(new DOMException("Hashing was cancelled. No evidence record was changed.","AbortError"));
      if(signal?.aborted){abort();return;} signal?.addEventListener("abort",abort,{once:true});
      worker.onmessage=(event:MessageEvent<{id:string;type:string;completed?:number;total?:number;sha256?:string;message?:string}>)=>{if(event.data.id!==id)return;if(event.data.type==="progress")onProgress(event.data.completed??0,event.data.total??file.size);else if(event.data.type==="done"&&event.data.sha256)finish(undefined,event.data.sha256);else if(event.data.type==="error")finish(new Error(event.data.message||"Local hashing failed."));};
      worker.onerror=()=>finish(new Error("Local hashing worker failed.")); worker.postMessage({id,file,chunkSize:1024*1024});
    });
  }

  export class EvidenceSessionLinks {
    private projectId = ""; private files = new Map<string,File>(); private states = new Map<string,SessionLinkState>();
    bindProject(projectId: string): void { if (this.projectId !== projectId) { this.clear(); this.projectId=projectId; } }
    setHashing(evidenceId: string): void { this.states.set(evidenceId,"hashing"); }
    setExact(evidenceId: string,file: File): void { this.files.set(evidenceId,file);this.states.set(evidenceId,"linked-exact"); }
    setTransient(evidenceId: string,state: "mismatch"|"cancelled"|"error"): void { this.files.delete(evidenceId);this.states.set(evidenceId,state); }
    getState(evidenceId: string): SessionLinkState { return this.states.get(evidenceId)??"unlinked"; }
    getFile(evidenceId: string): File|undefined { return this.files.get(evidenceId); }
    unlink(evidenceId: string): void { this.files.delete(evidenceId);this.states.delete(evidenceId); }
    clear(): void { this.files.clear();this.states.clear();this.projectId=""; }
  }
}
