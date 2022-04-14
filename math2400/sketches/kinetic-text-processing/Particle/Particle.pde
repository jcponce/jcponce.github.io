private static final int PARTICLE_ARRAY_LIST_INITIAL_CAPACITY = 1024;

abstract class Particle {
  ParticleObserver observer;

  float xPosition;
  float yPosition;
  int properFrameCount;

  Particle(float x, float y) {
    xPosition = x;
    yPosition = y;
  }
  
  void setObserver(ParticleObserver obs) {
    observer = obs;
  }

  void update() {
    properFrameCount++;
  }
  
  void display() {
  }
}



final class ParticleObserver {
  final ArrayList<Particle> newParticleList = new ArrayList<Particle>(PARTICLE_ARRAY_LIST_INITIAL_CAPACITY);
  final ArrayList<Particle> deadParticleList = new ArrayList<Particle>(PARTICLE_ARRAY_LIST_INITIAL_CAPACITY);
  
  ParticleObserver() {
  }
  
  void registerNew(Particle bornParticle) {
    newParticleList.add(bornParticle);
  }
  
  void registerDead(Particle killedParticle) {
    deadParticleList.add(killedParticle);
  }
  
  void updateParticleListMembers(ArrayList<Particle> list) {
    list.removeAll(deadParticleList);
    deadParticleList.clear();
    list.addAll(newParticleList);
    newParticleList.clear();
  }
}



final class ParticleSystem {
  final ArrayList<Particle> liveParticleList;
  final ParticleObserver observer;
  
  ParticleSystem() {
    liveParticleList = new ArrayList<Particle>(PARTICLE_ARRAY_LIST_INITIAL_CAPACITY);
    observer = new ParticleObserver();
  }

  void run() {
    update();
    display();
  }

  void update() {
    for (Particle currentObject : liveParticleList) {
      currentObject.update();
    }
    observer.updateParticleListMembers(liveParticleList);
  }

  void display() {
    for (Particle currentObject : liveParticleList) {
      currentObject.display();
    }
  }

  void registerNew(Particle obj) {
    observer.registerNew(obj);
    obj.setObserver(observer);
  }
}