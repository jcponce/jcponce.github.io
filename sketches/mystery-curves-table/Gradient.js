class Gradient {
  constructor() {
    //Get some colors from https://coolors.co
    this.cls0 = "https://coolors.co/e6dfe0-dfe6e4-b1b5b4-847f80-ffffff"
    this.cls1 = "https://coolors.co/2364aa-3da5d9-73bfb8-fec601-ea7317";
    this.cls2 = "https://coolors.co/b0d0d3-c08497-dc9a9a-f7af9d-f7e3af";
    this.cls3 = "https://coolors.co/565264-706677-a6808c-ccb7ae-d6cfcb";
    this.cls4 = "https://coolors.co/0b3954-087e8b-bfd7ea-ff5a5f-c81d25";
    this.cls5 = "https://coolors.co/ba1200-ac7279-9dd1f1-508aa8-c8e0f4";
    this.cls6 = "https://coolors.co/edf67d-f896d8-ca7df9-9e65f9-724cf9";
    this.cls7 = "https://coolors.co/0073c5-2ac1d8-fff2e1-ffa857-e55120";
    this.cls8 = "https://coolors.co/00b0e6-00e6f2-fdfde3-fee1c5-f38981";
    this.cls9 = "https://coolors.co/9393ba-9f9fc8-b6e9f2-93f6a4-a5f66c"
    
    this.settings();
  }

  settings() {
    this.r = random() * 10;
    if (this.r < 1) {
      this.colors = this.crtCols(this.cls0);
    } else if (1 <= this.r && this.r < 2) {
      this.colors = this.crtCols(this.cls1);
    } else if (2 <= this.r && this.r < 3) {
      this.colors = this.crtCols(this.cls2);
    } else if (3 <= this.r && this.r < 4) {
      this.colors = this.crtCols(this.cls3);
    } else if (4 <= this.r && this.r < 5) {
      this.colors = this.crtCols(this.cls4);
    } else if (5 <= this.r && this.r < 6) {
      this.colors = this.crtCols(this.cls5);
    } else if (6 <= this.r && this.r < 7) {
      this.colors = this.crtCols(this.cls6);
    } else if (7 <= this.r && this.r < 8) {
      this.colors = this.crtCols(this.cls7);
    } else if (8 <= this.r && this.r < 9) {
      this.colors = this.crtCols(this.cls8);
    } else if (9 <= this.r && this.r <= 10) {
      this.colors = this.crtCols(this.cls9);
    }
  }

  sample(value) {
    let v = map(value, 0, 1, 0, this.colors.length - 1);
    let s = floor(v);
    let e = s + 1;
    return lerpColor(this.colors[s], this.colors[e], v % 1);
  }

  //Gets the colors as an array
  crtCols(url) {
    let slash_index = url.lastIndexOf("/");
    let pallate_str = url.slice(slash_index + 1);
    let arr = pallate_str.split("-");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = color("#" + arr[i]);
    }
    return arr;
  }


}