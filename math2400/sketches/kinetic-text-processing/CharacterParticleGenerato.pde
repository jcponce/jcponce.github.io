final class CharacterParticleGenerator {
  final CharacterParticleGenerateManager manager;
  final String stringData;
  final float initialXPosition, initialYPosition;
  final int characterIntervalFrameCount;
  final int stringLength;
  final float textSizeValue;
  final boolean propotionalIndicator;
  final int particleLifetimeFrameCount;

  float currentXPosition, currentYPosition;
  int currentStringIndex;

  int delayFrameCount;
  int properFrameCount;
  
  CharacterParticleGenerator(CharacterParticleGenerateManager man, String s, int delayFrames, float x, float y, float sizeVal, int intervalFrames, boolean propotional, int lifetime) {
    manager = man;
    stringData = s;
    stringLength = s.length();
    delayFrameCount = delayFrames;
    initialXPosition = x;
    initialYPosition = y;
    currentXPosition = x;
    currentYPosition = y;
    textSizeValue = sizeVal;
    characterIntervalFrameCount = intervalFrames;
    propotionalIndicator = propotional;
    particleLifetimeFrameCount = lifetime;
  }

  void run() {
    if (delayFrameCount > 0) {
      delayFrameCount--;
      return;
    }
    if (currentStringIndex >= stringLength) {
      return;  // Just to be safe
    }
    
    if (characterIntervalFrameCount == 0) {
      generateAll();
      return;
    }
    if (properFrameCount % characterIntervalFrameCount == 0) {
      generateNext();
    }
    
    properFrameCount++;
  }
  
  void generateNext() {
    while(stringData.substring(currentStringIndex, currentStringIndex + 1).equals("\n")) {    // Not using char because of restriction of processing.js and JavaScript.
      breakLine();
      currentStringIndex++;
    }
    generateCharacterAt(currentStringIndex);

    if(propotionalIndicator) {
      textSize(textSizeValue);
      currentXPosition += textWidth(stringData.charAt(currentStringIndex));
    }
    else currentXPosition += textSizeValue;

    currentStringIndex++;
    if (currentStringIndex >= stringLength) manager.registerCompletedGenerator(this);
  }
  
  void generateAll() {
    for(int i = 0; i < stringLength; i++) {
      if(stringData.substring(i, i + 1).equals("\n")) {    // Not using char because of restriction of processing.js and JavaScript.
        breakLine();
        continue;
      }
      generateCharacterAt(i);
    }
    manager.registerCompletedGenerator(this);
    currentStringIndex = stringLength;
  }
  
  void generateCharacterAt(int index) {
    currentParticleSystem.registerNew(new CharacterParticle(currentXPosition, currentYPosition, stringData.charAt(index), textSizeValue, particleLifetimeFrameCount));
  }
  
  void breakLine() {
    currentXPosition = initialXPosition;
    currentYPosition += textSizeValue * 1.25f;
  }
}



final class CharacterParticleGenerateManager {
  ArrayList<CharacterParticleGenerator> generatorList = new ArrayList<CharacterParticleGenerator>();
  ArrayList<CharacterParticleGenerator> completedGeneratorList = new ArrayList<CharacterParticleGenerator>();
  
  float xPosition, yPosition, textSizeValue;
  int intervalFrameCount, particleLifetime, delayFrameCount;
  boolean propotionalIndicator;
  
  CharacterParticleGenerateManager() {
  }
  
  void run() {
    for(CharacterParticleGenerator currentObject : generatorList) {
      currentObject.run();
    }
    generatorList.removeAll(completedGeneratorList);
    completedGeneratorList.clear();
  }
  
  void registerCompletedGenerator(CharacterParticleGenerator generator) {
    completedGeneratorList.add(generator);
  }
  
  CharacterParticleGenerateManager registerString(String s) {
    generatorList.add(new CharacterParticleGenerator(this, s, delayFrameCount, xPosition, yPosition, textSizeValue, intervalFrameCount, propotionalIndicator, particleLifetime));
    return this;
  }
  
  CharacterParticleGenerateManager setPosition(float x, float y) {
    xPosition = x;
    yPosition = y;
    return this;
  }
  CharacterParticleGenerateManager setXPosition(float x) {
    xPosition = x;
    return this;
  }
  CharacterParticleGenerateManager setYPosition(float y) {
    yPosition = y;
    return this;
  }
  CharacterParticleGenerateManager setDelayFrameCount(int v) {
    delayFrameCount = v;
    return this;
  }
  CharacterParticleGenerateManager setDelaySeconds(float v) {
    delayFrameCount = int(v * IDEAL_FRAME_RATE);
    return this;
  }
  CharacterParticleGenerateManager setTextSize(float v) {
    textSizeValue = v;
    return this;
  }
  CharacterParticleGenerateManager setIntervalFrameCount(int v) {
    intervalFrameCount = v;
    return this;
  }
  CharacterParticleGenerateManager setPropotionalIndicator(boolean v) {
    propotionalIndicator = v;
    return this;
  }
  CharacterParticleGenerateManager setLifetime(int v) {
    particleLifetime = v;
    return this;
  }
  CharacterParticleGenerateManager breakLine(float factor) {
    yPosition += textSizeValue * 1.2f * factor;
    return this;
  }
}