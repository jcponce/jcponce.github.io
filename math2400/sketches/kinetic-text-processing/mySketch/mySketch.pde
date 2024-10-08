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

float defaultTextSizeValue = 45f;
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

  float d = 0.5f;
  float x = 70f;
  float y = 30f;
  int intervalFrm = 5;
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
    .breakLine(0.5f)
    .registerString("For every ε>0,")
    .breakLine(1.0f)
    .registerString("∃ n∈ℕ such that 1/n<ε")
    .breakLine(1.0f)
    .registerString("bₙ=inf{xₖ:k≥n}")
    .breakLine(2.4f)
    .registerString("f:[0,1]→ℝ;")
    .breakLine(1.0f)
    .registerString("f(x)=1,x∈ℚ; and f(x)=0,x∉ℚ")
    .breakLine(1.0f)
    .registerString("f∉ℛ[a,b]")
    .breakLine(2.4f)
    .setDelaySeconds(d+=0.5f)
    .registerString("|x²−y²|≤|x−y|, x,y∈(0,∞)")
    .breakLine(1.2f)
    .setDelaySeconds(d+=0.5f)
    .registerString("Mᵢ=sup{f(x):x∈[0,1]}")
    .breakLine(1.2f)
    .setDelaySeconds(d+=2f)
    .registerString("lim(f(x)−f(c))/(x−c)=f'(c)")
    .breakLine(1.2f)
    .setDelaySeconds(d+=0.5f)
    .registerString("fₙ→f uniformly as n→∞")
    ;
}

void mousePressed() {
  initialize();
}
