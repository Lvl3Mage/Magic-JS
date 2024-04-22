class CoordUtils{
	static ScreenSpaceToWorldSpace(vect){
		return new Vector2(vect.x + game.camera.x, vect.y + game.camera.y);
	}
	static WorldSpaceToScreenSpace(vect){
		return new Vector2(vect.x - game.camera.x, vect.y - game.camera.y);
	}
	static TransformPoint(point, position, rotation){
		let x = point.x * Math.cos(rotation) - point.y * Math.sin(rotation);
		let y = point.x * Math.sin(rotation) + point.y * Math.cos(rotation);
		return new Vector2(x + position.x, y + position.y);
	}
	static InverseTransformPoint(point, position, rotation){
		let x = point.x - position.x;
		let y = point.y - position.y;
		let x1 = x * Math.cos(rotation) + y * Math.sin(rotation);
		let y1 = -x * Math.sin(rotation) + y * Math.cos(rotation);
		return new Vector2(x1, y1);
	}
}