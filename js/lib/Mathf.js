class Mathf
{
	static Clamp(value, min, max){
		return Math.max( min, Math.min(value, max) )
	}
	static Clamp01(value){
		return Mathf.Clamp(value, 0, 1);
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
		if (angle > 180)        {  angle -= 360; }
		else if (angle <= -180) { angle += 360; }

		return angle;
	}
	static DeltaAngle(current, target){
		let num = Mathf.WrapAngle(target - current);
		if (num > 180)
		{
			num -= 360;
		}
		return num;
	}
	static SmoothMax(a, b, k){
		return Math.log(Math.exp(a * k) + Math.exp(b * k)) / k;
	}
	static SmoothMin(a, b, k){
		return -Mathf.SmoothMax(-a, -b, k);
	}
	static Activation01(x, slope){
		const powX = Math.pow(x, slope);
		const invPowX = Math.pow(1-x, slope);
		return powX / (powX + invPowX);
	}
}
