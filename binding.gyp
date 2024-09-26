{
	"targets": [
		{
			"sources": [ "src/lib/main.cpp" ],
			
			"target_name": "main",
			"product_name": "main",  
			"output_dir": "../dist/lib",
			"product_dir": "../dist/lib",
			"product_extension": "node",

			"include_dirs": [
				"node_modules/node-addon-api"
			],

			"conditions": [
				[ 
					"OS=='win'", 
					{
						"defines": [ "_HAS_EXCEPTIONS=0" ]
					}
				]
			],
			"cflags": [ 
				"/EHsc",
				"/O2",
				"/GL",
				"/GR-",
				"/GF",
				"/Gy",
				"/MP",
				"/arch:AVX2"
			],
      		"ldflags": [ 
				"/LTCG",
				"/OPT:ICF",
				"/OPT:REF"
			],

			"defines": [
				"NAPI_CPP_EXCEPTIONS"
			],

			"msvs_settings": {
				"VCCLCompilerTool": {
					"AdditionalOptions": [ "/EHsc" ]
				},
				"Link": {
					"GenerateDebugInformation": "false",
					"LinkIncremental": "false",
					"IgnoreImportLibrary": "true",
					"OutputFile": "dist\\lib\\main.node"
				},
				"LinkIncremental": "false"
			}
		}
	]
}
