//============================================================
// STUDENT NAME: <Lu Shumin>
// MATRIC NO.  : <A0091827X>
// NUS EMAIL   : <a0091827@nus.edu.sg>
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
// ============================================================
//
// FILE: assign2.frag


// The GL_EXT_gpu_shader4 extension extends GLSL 1.10 with 
// 32-bit integer (int) representation, integer bitwise operators, 
// and the modulus operator (%).

#extension GL_EXT_gpu_shader4 : require

#extension GL_ARB_texture_rectangle : require


uniform sampler2DRect InputTex;  // The input texture.

uniform int TexWidth;   // Always an even number.
uniform int TexHeight;

uniform int PassCount;  // For the very first pass, PassCount == 0.


void main()
{
    float P1 = texture2DRect( InputTex, gl_FragCoord.xy ).a;
    float P2;

    if ( PassCount % 2 == 0 )  // PassCount is Even.
    {

		
		int row = int( gl_FragCoord.y );
        int column = int( gl_FragCoord.x );
		
		// if column is even   check it and what after it
		if (column % 2 == 0)
		{
			vec2 p2vec = vec2( column+1, row);
			P2 = texture2DRect( InputTex, p2vec).a;
			if (P1 > P2)
			{
				gl_FragColor = vec4(P2);
			}
			else
			{
				gl_FragColor = vec4(P1);
			}

		}
		else
		{
			// if column is old    check it and what before it
			vec2 p2vec = vec2( column-1, row);
			P2 = texture2DRect( InputTex, p2vec).a;
			if (P1 < P2)
			{
				gl_FragColor = vec4(P2);
			}
			else
			{
				gl_FragColor = vec4(P1);
			}

		}

    }

    else  // PassCount is Odd.
    {
        int row = int( gl_FragCoord.y );
        int column = int( gl_FragCoord.x );
        int index1D = row * TexWidth + column;
		
		if (index1D % 2 == 0)
		{
			if(index1D == 0)
			{
				gl_FragColor = vec4(P1);
			}
			else
			{
				int target = index1D - 1;


				vec2 p2vec = vec2( target % TexWidth, target / TexWidth);
				P2 = texture2DRect( InputTex, p2vec).a;
				if (P1 < P2)
				{
					gl_FragColor = vec4(P2);
				}
				else
				{
					gl_FragColor = vec4(P1);
				}
			}
			

		}
		else
		{
			// if column is old    check it and what before it
			if(index1D == TexWidth * TexHeight - 1)
			{
				gl_FragColor = vec4(P1);
			}
			else
			{
				int target = index1D + 1;


				vec2 p2vec = vec2( target % TexWidth, target / TexWidth);
				P2 = texture2DRect( InputTex, p2vec).a;
				if (P1 > P2)
				{
					gl_FragColor = vec4(P2);
				}
				else
				{
					gl_FragColor = vec4(P1);
				}
			}

		}
    }
}
