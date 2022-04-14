final class CharacterParticle extends Particle {
  final int lifeTime;
  final char charData;
  final float textSizeValue;
  
  float xVelocity, yVelocity;
  float rotationAngle, angularVelocity;

  float progressRatio;

  CharacterParticle(float x, float y, char c, float sz, int life) {
    super(x, y);
    charData = c;
    textSizeValue = sz;
    lifeTime = life;
  }
  
  void update() {
    super.update();
    if(properFrameCount > lifeTime) {
      observer.registerDead(this);
    }
    
    progressRatio = getProgressRatio();
    final float waitTimeFactor = 0.3f;
    final float waftRatio = max(0f, progressRatio - waitTimeFactor) / (1f - waitTimeFactor);
    
    final float v = 4f / IDEAL_FRAME_RATE;
    xVelocity += waftRatio * random(-v, v);
    yVelocity += waftRatio * (random(-v, v) - 0.2f / IDEAL_FRAME_RATE);
    xPosition += xVelocity;
    yPosition += yVelocity;
    
    final float v2 = 0.1f / IDEAL_FRAME_RATE;
    angularVelocity += waftRatio * random(-v2, v2);
    rotationAngle += angularVelocity;
    
    if (this.isOutOfScreen(textSizeValue)) observer.registerDead(this);
  }

  void display() {
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);

    float alpha;
    final float fadeInTimeFactor = 0.1f;
    final float fadeOutTimeFactor = 0.5f;
    if(getProgressRatio() < fadeInTimeFactor) alpha = 100f * easeOutQuad(progressRatio / fadeInTimeFactor);
    else if(progressRatio > 1f - fadeOutTimeFactor) alpha = 100f * easeInQuad(getFadeRatio() / fadeOutTimeFactor);
    else alpha = 100f;
    fill(0f, 0f, 20f, alpha);
    
    float scaleFactor = 1f + 0.6f * (1f - easeOutQuart(min(progressRatio * 20f, 1f)));
    pushMatrix();
    translate(xPosition, yPosition);
    if (scaleFactor > 1.05f) scale(scaleFactor);
    rotate(rotationAngle);

    text(charData, 0f, 0f);

    popMatrix();
  }
  
  float getProgressRatio() {
    return min(properFrameCount, lifeTime) / float(lifeTime);
  }
  float getFadeRatio() {
    return 1f - getProgressRatio();
  }
  
  boolean isOutOfScreen(float outerMargin) {
    if (yPosition < -outerMargin) return true;
    if (yPosition > height + outerMargin) return true;
    if (xPosition < -outerMargin) return true;
    if (xPosition > width + outerMargin) return true;
    return false;
  }
}
