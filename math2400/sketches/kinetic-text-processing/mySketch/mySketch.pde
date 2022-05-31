// Made with Processing 3.3.6

/* @pjs font="font_1_honokamin_subset.ttf"; */
/*
[About the font used here]
The font file "font_1_honokamin_subset.ttf" is ...
 - a Derived Program from a font "Honoka Mincho" (http://font.gloomy.jp/),
   which is also a Derived Program from a font "IPAex Mincho" (Copyright(C) Information-technology Promotion Agency, Japan (IPA), 2003-2013.).
 - made by extracting subset characters from the font "Honoka Mincho".
   The original font "IPAex Mincho" is available from IPA WebSite (http://ipafont.ipa.go.jp/).
 - licensed under IPA FONT LICENSE AGREEMENT V1.0 (http://ipafont.ipa.go.jp/ipa_font_license_v1.html).
*/


private static final float IDEAL_FRAME_RATE = 60f;
private static final String RENDER_MODE = P2D;

float defaultTextSizeValue = 52f;
String fontFilePath = "unicode.palatino.ttf";

ParticleSystem currentParticleSystem;
CharacterParticleGenerateManager manager;


void setup() {
  size( window.innerWidth, window.innerHeight, RENDER_MODE);
  //fullScreen();
  colorMode(HSB, 360f, 100f, 100f, 100f);
  textFont(createFont(fontFilePath, defaultTextSizeValue, true));

  initialize();
}

void draw() {
  background(0f, 0f, 100f);
  
  manager.run();
  currentParticleSystem.run();
}

void initialize() {
  currentParticleSystem = new ParticleSystem();

  // Text from: http://www.aozora.gr.jp/cards/001529/files/44909_29558.html

  float d = 1f;
  float x = 70f;
  float y = 160f;
  int intervalFrm = 10;
  int life = int(IDEAL_FRAME_RATE * 30f);
  boolean proportionalIndicator = false;
  
  manager = new CharacterParticleGenerateManager()
    .setPosition(x, y)
    .setTextSize(defaultTextSizeValue)
    .setIntervalFrameCount(intervalFrm)
    .setPropotionalIndicator(proportionalIndicator)
    .setLifetime(life)
    ;
  manager
    .setDelaySeconds(d)
    .breakLine(1.0f)
    .registerString("Without practicing")
    .breakLine(2.4f)
    .setDelaySeconds(d+=1f)
    .registerString("Learning mathematics")
    .breakLine(1.2f)
    .setDelaySeconds(d+=1.5f)
    .registerString("cannot happen")
    .breakLine(1.2f)
    .setDelaySeconds(d+=2f)
    .registerString("Topology")
    ;
}

void mousePressed() {
  initialize();
}
