// BGEnhanced.cpp : 定义 DLL 的导出函数。
//

#include "pch.h"
#include "framework.h"
#include "BGEnhanced.h"
#include <functional>
#include <string>
#include <thread>

char* testApi(void** args);
char* fixBGPosition(void** args);

int BetterNCMPluginMain(BetterNCMNativePlugin::PluginAPI* api)
{
	api->addNativeAPI(new BetterNCMNativePlugin::NativeAPIType[1]{ BetterNCMNativePlugin::NativeAPIType::V8Value }, 1, "bgenhanced.test", testApi);

	api->addNativeAPI(new BetterNCMNativePlugin::NativeAPIType[1]{ BetterNCMNativePlugin::NativeAPIType::Boolean },1, 
		"bgenhanced.fixBGPosition",	fixBGPosition);

	return 0;
}

