class Mathf
{
	static Clamp(value, min, max){
			return Math.max( min, Math.min(value, max) )
		}
	static Lerp(a, b, t) {
		return (1 - t) * a + t * b;
	}
	static TransformRange(OldMin, OldMax,NewMin,NewMax, value){
		let OldRange = (OldMax - OldMin);
		let NewRange = (NewMax - NewMin);
		return (((value - OldMin) * NewRange) / OldRange) + NewMin;
	}
	static Deg2Rad(deg){
		return deg * (Math.PI/180);
	}
	static Rad2Deg(rad){
		return rad * (180/Math.PI);
	}
	static WrapAngle(angle){
		if (angle > 180)        { angle -= 360; }
		else if (angle <= -180) { angle += 360; }

		return angle;
	}
}
