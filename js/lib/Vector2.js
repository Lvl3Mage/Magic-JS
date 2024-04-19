
class Vector2{
	x = 0;
	y = 0;
	constructor(x,y){
		if(typeof(x) != "number" || typeof(y) != "number"){

			console.error("Could not construct a Vector2 because one ar both of the parameters passed is not of type 'Number'. The parameter types were: x - " + typeof(x) + ", y - " + typeof(y) + ".");
		}
		this.x = x;
		this.y = y;
	}
	Add(vector){
		return new Vector2(this.x+vector.x, this.y+vector.y);
	}

	static Add(vectorA, vectorB){
		return new Vector2(vectorA.x+vectorB.x, vectorA.y+vectorB.y);
	}
	Sub(vector){
		return new Vector2(this.x-vector.x, this.y-vector.y);
	}
	static Sub(vectorA, vectorB){
		return new Vector2(vectorA.x-vectorB.x, vectorA.y-vectorB.y);
	}
	Scale(scaleFactor){
		var result = new Vector2(this.x, this.y);
		result.x *= scaleFactor;
		result.y *= scaleFactor;
		return result;
	}
	Normalized(){
		var result = new Vector2(this.x, this.y);
		var vectorLength = result.Length()
		result.x /= vectorLength;
		result.y /= vectorLength;
		return result;
	}
	static Normalized(vector){
		var vectorLength = vector.Length()
		vector.x /= vectorLength;
		vector.y /= vectorLength;
		return vectorLength;
	}
	PairWise(action){
		return new Vector2(action(this.x), action(this.y));
	}
	static PairWise(vector, action){
		return new Vector2(action(vector.x), action(vector.y));
	}
	Length(){
		return Math.sqrt(this.x*this.x + this.y * this.y);
	}
	ClampLength(min, max){
		let result = new Vector2(this.x, this.y);
		var vectorLength = result.Length();
		if(vectorLength == 0){
			return Vector2.zero;
		}
		result.x /= vectorLength;
		result.y /= vectorLength;
		var newLength = Mathf.Clamp(min, vectorLength, max);
		result.x *= newLength;
		result.y *= newLength;
		return result;
	}
	PerpendicularLeft(){
		return new Vector2(-this.y,this.x);
	}
	PerpendicularRight(){
		return new Vector2(this.y,-this.x);
	}
	isZero(epsilon){
		let sqLength = this.x*this.x + this.y*this.y;
		return sqLength<=epsilon*epsilon;
	}
	Equal(otherVector){
		return this.x == otherVector.x && this.y == otherVector.y;
	}
	Clone(){
		return new Vector2(this.x, this.y);
	}
	ToPoint(){
		return new Phaser.Point(this.x, this.y);
	}
	static ToPoint(vector){
		return new Phaser.Point(vector.x, vector.y);
	}
	Rotate(angle) {
		let sin = Math.sin(Mathf.Deg2Rad(angle));
		let cos = Math.cos(Mathf.Deg2Rad(angle));
		let tx = this.x;
		let ty = this.y;
		return new Vector2((cos * tx) - (sin * ty), (sin * tx) + (cos * ty))
	 }
	static Lerp(startVector, endVector, t){
		return Vector2.Add(startVector.Scale(1-t),endVector.Scale(t));
	}
	static Distance(vectorA, vectorB){
		return Vector2.Sub(vectorA, vectorB).Length;
	}
	static FromJSObject(JSObject){
		return new Vector2(JSObject.x, JSObject.y);
	}
	static CrossProduct(vectorA, vectorB){
		return vectorA.x*vectorB.y - vectorA.y*vectorB.x;
	}
	static DotProduct(vectorA, vectorB){
		return vectorA.x*vectorB.x + vectorA.y*vectorB.y;
	}
	static Angle(vectorA, vectorB){
		let angle = Mathf.Rad2Deg(Math.atan2(vectorB.y, vectorB.x) - Math.atan2(vectorA.y, vectorA.x));

		return Mathf.WrapAngle(angle);
	}
	static PerpendicularLeft(vector){
		return new Vector2(-vector.y,vector.x);
	}
	static PerpendicularRight(vector){
		return new Vector2(vector.y,-vector.x);
	}
	static get zero(){ return new Vector2(0,0);}
	static get up(){ return new Vector2(0,1);}
	static get down(){ return new Vector2(0,-1)};
	static get left(){ return new Vector2(-1,0)};
	static get right(){ return new Vector2(1,0);}
}