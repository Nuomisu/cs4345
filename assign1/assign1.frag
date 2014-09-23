//============================================================
// STUDENT NAME: <your name>
// MATRIC NO.  : <matric no.>
// NUS EMAIL   : <your NUS email address>
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
//============================================================
//
// FILE: assign1.frag


//============================================================================
// Eye-space position and vectors for setting up a tangent space at the fragment.
//============================================================================

varying vec3 ecPosition;    // Fragment's 3D position in eye space.
varying vec3 ecNormal;      // Fragment's normal vector in eye space.
varying vec3 ecTangent;     // Frgament's tangent vector in eye space.


//============================================================================
// TileDensity specifies the number of tiles to span across each dimension when the
// texture coordinates gl_TexCoord[0].s and gl_TexCoord[0].t range from 0.0 to 1.0.
//============================================================================

uniform float TileDensity;  // (0.0, inf)


//============================================================================
// TubeRadius is the radius of the semi-circular mirror tubes that run along 
// the boundary of each tile. The radius is relative to the tile size, which 
// is considered to be 1.0 x 1.0.
//============================================================================

uniform float TubeRadius;  // (0.0, 0.5]


//============================================================================
// StickerWidth is the width of the square sticker. The entire square sticker 
// must appear at the center of each tile. The width is relative to the 
// tile size, which is considered to be 1.0 x 1.0.
//============================================================================

uniform float StickerWidth;  // (0.0, 1.0]


//============================================================================
// EnvMap references the environment cubemap for reflection mapping.
//============================================================================

uniform samplerCube EnvMap;


//============================================================================
// DiffuseTex1 references the wood texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the non-mirror and
// non-sticker regions.
//============================================================================

uniform sampler2D DiffuseTex1;


//============================================================================
// DiffuseTex2 references the sticker texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the sticker regions.
//============================================================================

uniform sampler2D DiffuseTex2;




void main()
{
    vec2 c = TileDensity * gl_TexCoord[0].st;

	

    vec2 p = fract( c ) - vec2( 0.5 );

    // Some useful eye-space vectors.
    vec3 ecNNormal = normalize( ecNormal );
    vec3 ecViewVec = -normalize( ecPosition );


    //////////////////////////////////////////////////////////
    // REPLACE THE CONDITION IN THE FOLLOWING IF STATEMENT. //
    //////////////////////////////////////////////////////////

    if ( dot (ecNNormal, ecViewVec) < 0.0 )
    {
        //======================================================================
        // In here, fragment is backfacing or in the non-bump region.
        //======================================================================

        // For the lighting computation, use the half-vector approach 
        // to compute the specular component.


        ///////////////////////////
        // WRITE YOUR CODE HERE. //
        ///////////////////////////

		vec3 viewVec = -normalize( ecPosition );
		vec3 necNormal = - normalize( ecNormal );
		vec3 lightPos = vec3( gl_LightSource[0].position ) / gl_LightSource[0].position.w;
		vec3 lightVec = normalize( lightPos - ecPosition );
		vec3 halfVector = normalize( lightVec + viewVec );
	
		float N_dot_L = max( 0.0, dot( necNormal, lightVec ) );
		float N_dot_H = max( 0.0, dot( necNormal, halfVector ) );

		float pf = ( N_dot_H == 0.0 )? 0.0 : pow( N_dot_H, gl_FrontMaterial.shininess );
	
		vec4 wood =  texture2D(DiffuseTex1, gl_TexCoord[0].st);

		gl_FragColor = gl_FrontLightModelProduct.sceneColor * wood +
				( gl_LightSource[0].ambient) * gl_FrontMaterial.ambient * wood +
				( gl_LightSource[0].diffuse) * gl_FrontMaterial.diffuse * N_dot_L * wood +
				( gl_LightSource[0].specular) * gl_FrontMaterial.specular * pf;

    }
    else
    {
        //======================================================================
        // In here, fragment is front-facing and in the mirror-like bump region.
        //======================================================================

        vec3 N = ecNNormal;
        vec3 B = normalize( cross( N, ecTangent ) );
        vec3 T = cross( B, N );

        vec3 tanPerturbedNormal;  // The perturbed normal vector in tangent space of fragment.
        vec3 ecPerturbedNormal;   // The perturbed normal vector in eye space.
        vec3 ecReflectVec;        // The mirror reflection vector in eye space.

		vec3 v;
		v.x = dot(T, ecPosition);
		v.y = dot(B, ecPosition);
		v.z = dot(N, ecPosition);
		
		vec3 eyeDirction = normalize(v);
		//vec3 normDelta = normalize( vec3(p.x, p.y, 1.0) );
		//vec3 reflectDir = reflect(-eyeDirction, normDelta);

        ///////////////////////////
        // WRITE YOUR CODE HERE. //
        ///////////////////////////
		vec3 viewVec = -normalize( ecPosition );
		vec3 necNormal = normalize( ecNormal );
		vec3 lightPos = vec3( gl_LightSource[0].position ) / gl_LightSource[0].position.w;
		vec3 lightVec = normalize( lightPos - ecPosition );
		vec3 halfVector = normalize( lightVec + viewVec );
	
		float N_dot_L = max( 0.0, dot( necNormal, lightVec ) );
		float N_dot_H = max( 0.0, dot( necNormal, halfVector ) );

		float pf = ( N_dot_H == 0.0 )? 0.0 : pow( N_dot_H, gl_FrontMaterial.shininess );
	
		vec4 wood =  texture2D(DiffuseTex1, gl_TexCoord[0].st);

		gl_FragColor = gl_FrontLightModelProduct.sceneColor * wood +
				gl_LightSource[0].ambient * gl_FrontMaterial.ambient * wood +
				gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * N_dot_L * wood +
				gl_LightSource[0].specular * gl_FrontMaterial.specular * pf;
		
	
		if ( p.s * 1.0 / StickerWidth > 0.5 || p.t * 1.0 / StickerWidth > 0.5 
		||  p.s * 1.0 / StickerWidth < -0.5 || p.t * 1.0 / StickerWidth < -0.5){
			
			if (((p.s * 1.0 < 0.5) && (p.s * 1.0 >0.5-TubeRadius))
				|| ((p.s * 1.0 > -0.5) &&( p.s * 1.0 < -0.5+TubeRadius))
				|| ((p.t * 1.0 < 0.5 )&&( p.t * 1.0 >0.5-TubeRadius))
				|| ((p.t * 1.0 > -0.5) &&( p.t * 1.0 < -0.5+TubeRadius))){

				vec3 reflectDir;
				if( (p.s * 1.0 < 0.5) && (p.s * 1.0 >0.5-TubeRadius) && (p.s > p.t) && (p.s > -p.t) )
				{
					vec3 normDelta = normalize( vec3( p.x-0.5 , 0.0 , sqrt(TubeRadius*TubeRadius-(0.5-p.x)*(0.5-p.x)) ) );
					reflectDir = reflect(eyeDirction, normDelta);
				}
				if( (p.s * 1.0 > -0.5) && (p.s * 1.0 < -0.5+TubeRadius) && (p.s < -p.t) && (p.s < p.t) )
				{
					vec3 normDelta = normalize( vec3( 0.5+p.x , 0.0 , sqrt(TubeRadius*TubeRadius-(0.5+p.x)*(0.5+p.x)) ) );
					reflectDir = reflect(eyeDirction, normDelta);
				}
				if( (p.t * 1.0 < 0.5) && (p.t * 1.0 >0.5-TubeRadius) && (p.s > -p.t) && (p.s < p.t))
				{
					vec3 normDelta = normalize( vec3(  0.0, p.y-0.5 , sqrt(TubeRadius*TubeRadius-(0.5-p.y)*(0.5-p.y)) ) );
					reflectDir = reflect(eyeDirction, normDelta);
				}
				if( (p.t * 1.0 > -0.5) && (p.t * 1.0 < -0.5+TubeRadius) && (p.s > p.t) && (p.s < -p.t))
				{
					vec3 normDelta = normalize( vec3( 0.0, 0.5+p.y , sqrt(TubeRadius*TubeRadius-(0.5+p.y)*(0.5+p.y)) ) );
					reflectDir = reflect(eyeDirction, normDelta);
				}
				gl_FragColor = textureCube(EnvMap, reflectDir);


			}else
				return;
			}else{

			//p = fract( c );// - vec2( 0.5 );

			vec2 sticker = p / StickerWidth;

			sticker += vec2(0.5);

			vec4 d =  texture2D(DiffuseTex2, sticker);
		
			//uniform float StickerWidth;  // (0.0, 1.0]

			gl_FragColor = gl_FrontLightModelProduct.sceneColor * d +
				gl_LightSource[0].ambient * gl_FrontMaterial.ambient * d +
				gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * N_dot_L * d +
				gl_LightSource[0].specular * gl_FrontMaterial.specular * pf;
		}
		
    }

}
