//============================================================
// STUDENT NAME: <your name>
// MATRIC NO.  : <matric no.>
// NUS EMAIL   : <your NUS email address>
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
//============================================================
//
// FILE: assign1.vert


varying vec3 ecPosition; // Vertex's position in eye space.
varying vec3 ecNormal;   // Vertex's normal vector in eye space.
varying vec3 ecTangent;  // Vertex's tangent vector in eye space.

attribute vec3 Tangent;  // Input vertex's tangent vector in model space.


void main( void )
{
	ecNormal = normalize( gl_NormalMatrix * gl_Normal ); //n
	vec4 ecPosition4 = gl_ModelViewMatrix * gl_Vertex; 
	ecPosition = vec3( ecPosition4 ) / ecPosition4.w; // -eyeDir
	ecTangent = normalize (gl_NormalMatrix * Tangent); //t

	gl_Position = ftransform();

	gl_TexCoord[0] = gl_MultiTexCoord0;

}
