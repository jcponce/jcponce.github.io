/*
 * Easing.pde - brings Robert Penner's easing functions into Processing
 * (c) 2015 cocopon.
 *
 * See the following to learn more about these famous functions:
 * http://robertpenner.com/easing/
 *
 * License:
 * http://robertpenner.com/easing_terms_of_use.html
 */

/*
 * Usage:
 *
 * 1. Put this file in the same folder as your sketch.
 *   + your_sketch/
 *   |-- your_sketch.pde
 *   |-- Easing.pde
 *   |-- ...
 *
 * 2. Enjoy!
 *   // Easier way to use an easing function
 *   // (t: 0.0 ~ 1.0)
 *   float value = easeOutBack(t);
 *   ...
 *
 *   // You can also instanciate an easing function
 *   Easing easing = new EasingOutBack();
 *   float value = easing.get(t);
 *   ...
 *
 *   // Or using an anonymous class to instanciate a custom easing function
 *   Easing easing = new Easing() {
 *     public float get(float t) {
 *       return sqrt(t);
 *     }
 *   };
 *   float value = easing.get(t);
 *   ...
 */

public interface Easing {
  public float get(float t);
}

public class EasingLinear implements Easing {
  public float get(float t) {
    return t;
  }
}

public class EasingInBack implements Easing {
  public float get(float t, float s) {
    return t * t * ((s + 1) * t - s);
  }

  public float get(float t) {
    return get(t, 1.70158);
  }
}

public class EasingInBounce implements Easing {
  public float get(float t) {
    t = 1.0 - t;

    if (t < 1 / 2.75) {
      return 1.0 - (7.5625 * t * t);
    }
    if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 1.0 - (7.5625 * t * t + 0.75);
    }
    if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 1.0 - (7.5625 * t * t + 0.9375);
    }

    t -= 2.625 / 2.75;
    return 1.0 - (7.5625 * t * t + 0.984375);
  }
}

public class EasingInCirc implements Easing {
  public float get(float t) {
    return -(sqrt(1 - t * t) - 1);
  }
}

public class EasingInCubic implements Easing {
  public float get(float t) {
    return t * t * t;
  }
}

public class EasingInElastic implements Easing {
  public float get(float t, float s) {
    float p = 0.3;
    float a = 1.0;

    if (t == 0) {
      return 0;
    }
    if (t == 1.0) {
      return 1.0;
    }

    if (a < 1.0) {
      a = 1.0;
      s = p / 4;
    }
    else {
      s = p / (2 * 3.1419) * asin(1.0 / a);
    }

    --t;
    return -(a * pow(2, 10 * t) * sin((t - s) * (2 * 3.1419) / p));
  }

  public float get(float t) {
    return get(t, 1.70158);
  }
}

public class EasingInExpo implements Easing {
  public float get(float t) {
    return (t == 0)
      ? 0 
      : pow(2, 10 * (t - 1));
  }
}

public class EasingInQuad implements Easing {
  public float get(float t) {
    return t * t;
  }
}

public class EasingInQuart implements Easing {
  public float get(float t) {
    return t * t * t * t;
  }
}

public class EasingInQuint implements Easing {
  public float get(float t) {
    return t * t * t * t * t;
  }
}

public class EasingInSine implements Easing {
  public float get(float t) {
    return -cos(t * (PI / 2)) + 1.0;
  }
}

public class EasingOutBack implements Easing {
  public float get(float t, float s) {
    --t;
    return t * t * ((s + 1.0) * t + s) + 1.0;
  }

  public float get(float t) {
    return get(t, 1.70158f);
  }
}

public class EasingOutBounce implements Easing {
  public float get(float t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }
    if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    }
    if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    }

    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }
}

public class EasingOutCirc implements Easing {
  public float get(float t) {
    --t;
    return sqrt(1 - t * t);
  }
}

public class EasingOutCubic implements Easing {
  public float get(float t) {
    --t;
    return t * t * t + 1;
  }
}

public class EasingOutElastic implements Easing {
  public float get(float t, float s) {
    float p = 0.3;
    float a = 1.0;

    if (t == 0) {
      return 0;
    }
    if (t == 1.0) {
      return 1.0;
    }

    if (a < 1.0) {
      a = 1.0;
      s = p / 4;
    }
    else {
      s = p / (2 * 3.1419) * asin(1.0 / a);
    }
    return a * pow(2, -10 * t) * sin((t - s) * (2 * 3.1419) / p) + 1.0;
  }

  public float get(float t) {
    return get(t, 1.70158);
  }
}

public class EasingOutExpo implements Easing {
  public float get(float t) {
    return (t == 1.0)
      ? 1.0
      : (-pow(2, -10 * t) + 1);
  }
}

public class EasingOutQuad implements Easing {
  public float get(float t) {
    return -t * (t - 2);
  }
}

public class EasingOutQuart implements Easing {
  public float get(float t) {
    --t;
    return 1.0 - t * t * t * t;
  }
}

public class EasingOutQuint implements Easing {
  public float get(float t) {
    --t;
    return t * t * t * t * t + 1;
  }
}

public class EasingOutSine implements Easing {
  public float get(float t) {
    return sin(t * (PI / 2));
  }
}

public class EasingInOutBack implements Easing {
  public float get(float t, float s) {
    float k = 1.525;

    t *= 2;
    s *= k;

    if (t < 1) {
      return 0.5 * (t * t * ((s + 1) * t - s));
    }
    t -= 2;
    return 0.5 * (t * t * ((s + 1) * t + s) + 2);
  }

  public float get(float t) {
    return get(t, 1.70158);
  }
}

public class EasingInOutBounce implements Easing {
  Easing inBounce_ = new EasingInBounce();
  Easing outBounce_ = new EasingOutBounce();

  public float get(float t) {
    return (t < 0.5)
      ? (inBounce_.get(t * 2) * 0.5)
      : (outBounce_.get(t * 2 - 1.0) * 0.5 + 0.5);
  }
}

public class EasingInOutCirc implements Easing {
  public float get(float t) {
    t *= 2;

    if (t < 1) {
      return -0.5 * (sqrt(1 - t * t) - 1);
    }

    t -= 2;
    return 0.5 * (sqrt(1 - t * t) + 1);
  }
}

public class EasingInOutCubic implements Easing {
  public float get(float t) {
    t *= 2;

    if (t < 1) {
      return 0.5 * t * t * t;
    }

    t -= 2;
    return 0.5 * (t * t * t + 2);
  }
}

public class EasingInOutElastic implements Easing {
  public float get(float t, float s) {
    float p =  0.3 * 1.5;
    float a = 1.0;

    if (t == 0) {
      return 0;
    }
    if (t == 1.0) {
      return 1.0;
    }

    if (a < 1.0) {
      a = 1.0;
      s = p / 4;
    }
    else {
      s = p / (2 * 3.1419) * asin(1.0 / a);
    }

    if (t < 1) {
      --t;
      return -0.5 * (a * pow(2, 10 * t) * sin((t - s) * (2 * 3.1419) / p));
    }
    --t;
    return a * pow(2, -10 * t) * sin((t - s) * (2 * 3.1419) / p) * 0.5 + 1.0;
  }

  public float get(float t) {
    return get(t, 1.70158);
  }
}

public class EasingInOutExpo implements Easing {
  public float get(float t) {
    if (t == 0) {
      return 0;
    }
    if (t == 1.0) {
      return 1.0;
    }

    t *= 2;
    if (t < 1) {
      return 0.5 * pow(2, 10 * (t - 1));
    }

    --t;
    return 0.5 * (-pow(2, -10 * t) + 2);
  }
}

public class EasingInOutQuad implements Easing {
  public float get(float t) {
    t *= 2;

    if (t < 1) {
      return 0.5 * t * t;
    }

    --t;
    return -0.5 * (t * (t - 2) - 1);
  }
}

public class EasingInOutQuart implements Easing {
  public float get(float t) {
    t *= 2;

    if (t < 1) {
      return 0.5 * t * t * t * t;
    }

    t -= 2;
    return -0.5 * (t * t * t * t - 2);
  }
}

public class EasingInOutQuint implements Easing {
  public float get(float t) {
    t *= 2;

    if (t < 1) {
      return 0.5 * t * t * t * t * t;
    }

    t -= 2;
    return 0.5 * (t * t * t * t * t + 2);
  }
}

public class EasingInOutSine implements Easing {
  public float get(float t) {
    return -0.5 * (cos(PI * t) - 1);
  }
}

Easing easeInBack__    = new EasingInBack();
Easing easeInBounce__  = new EasingInBounce();
Easing easeInCirc__    = new EasingInCirc();
Easing easeInCubic__   = new EasingInCubic();
Easing easeInElastic__ = new EasingInElastic();
Easing easeInExpo__    = new EasingInExpo();
Easing easeInQuad__    = new EasingInQuad();
Easing easeInQuart__   = new EasingInQuart();
Easing easeInQuint__   = new EasingInQuint();
Easing easeInSine__    = new EasingInSine();

Easing easeOutBack__    = new EasingOutBack();
Easing easeOutBounce__  = new EasingOutBounce();
Easing easeOutCirc__    = new EasingOutCirc();
Easing easeOutCubic__   = new EasingOutCubic();
Easing easeOutElastic__ = new EasingOutElastic();
Easing easeOutExpo__    = new EasingOutExpo();
Easing easeOutQuad__    = new EasingOutQuad();
Easing easeOutQuart__   = new EasingOutQuart();
Easing easeOutQuint__   = new EasingOutQuint();
Easing easeOutSine__    = new EasingOutSine();

Easing easeInOutBack__    = new EasingInOutBack();
Easing easeInOutBounce__  = new EasingInOutBounce();
Easing easeInOutCirc__    = new EasingInOutCirc();
Easing easeInOutCubic__   = new EasingInOutCubic();
Easing easeInOutElastic__ = new EasingInOutElastic();
Easing easeInOutExpo__    = new EasingInOutExpo();
Easing easeInOutQuad__    = new EasingInOutQuad();
Easing easeInOutQuart__   = new EasingInOutQuart();
Easing easeInOutQuint__   = new EasingInOutQuint();
Easing easeInOutSine__    = new EasingInOutSine();

float easeInBack(float t, float s) {
  return ((EasingInBack)easeInBack__).get(t, s);
}

float easeInBack(float t) {
  return easeInBack__.get(t);
}

float easeInBounce(float t) {
  return easeInBounce__.get(t);
}

float easeInCirc(float t) {
  return easeInCirc__.get(t);
}

float easeInCubic(float t) {
  return easeInCubic__.get(t);
}

float easeInElastic(float t, float s) {
  return ((EasingInElastic)easeInElastic__).get(t, s);
}

float easeInElastic(float t) {
  return easeInElastic__.get(t);
}

float easeInExpo(float t) {
  return easeInExpo__.get(t);
}

float easeInQuad(float t) {
  return easeInQuad__.get(t);
}

float easeInQuart(float t) {
  return easeInQuart__.get(t);
}

float easeInQuint(float t) {
  return easeInQuint__.get(t);
}

float easeInSine(float t) {
  return easeInSine__.get(t);
}

float easeOutBack(float t, float s) {
  return ((EasingOutBack)easeOutBack__).get(t, s);
}

float easeOutBack(float t) {
  return easeOutBack__.get(t);
}

float easeOutBounce(float t) {
  return easeOutBounce__.get(t);
}

float easeOutCirc(float t) {
  return easeOutCirc__.get(t);
}

float easeOutCubic(float t) {
  return easeOutCubic__.get(t);
}

float easeOutElastic(float t, float s) {
  return ((EasingOutElastic)easeOutElastic__).get(t, s);
}

float easeOutElastic(float t) {
  return easeOutElastic__.get(t);
}

float easeOutExpo(float t) {
  return easeOutExpo__.get(t);
}

float easeOutQuad(float t) {
  return easeOutQuad__.get(t);
}

float easeOutQuart(float t) {
  return easeOutQuart__.get(t);
}

float easeOutQuint(float t) {
  return easeOutQuint__.get(t);
}

float easeOutSine(float t) {
  return easeOutSine__.get(t);
}

float easeInOutBack(float t, float s) {
  return ((EasingInOutBack)easeInOutBack__).get(t, s);
}

float easeInOutBack(float t) {
  return easeInOutBack__.get(t);
}

float easeInOutBounce(float t) {
  return easeInOutBounce__.get(t);
}

float easeInOutCirc(float t) {
  return easeInOutCirc__.get(t);
}

float easeInOutCubic(float t) {
  return easeInOutCubic__.get(t);
}

float easeInOutElastic(float t, float s) {
  return ((EasingInOutElastic)easeInOutElastic__).get(t, s);
}

float easeInOutElastic(float t) {
  return easeInOutElastic__.get(t);
}

float easeInOutExpo(float t) {
  return easeInOutExpo__.get(t);
}

float easeInOutQuad(float t) {
  return easeInOutQuad__.get(t);
}

float easeInOutQuart(float t) {
  return easeInOutQuart__.get(t);
}

float easeInOutQuint(float t) {
  return easeInOutQuint__.get(t);
}

float easeInOutSine(float t) {
  return easeInOutSine__.get(t);
}