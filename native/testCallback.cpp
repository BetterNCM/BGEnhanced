#include "pch.h"
#include <include/capi/cef_task_capi.h>
#include <include/capi/cef_v8_capi.h>
#include <thread>

typedef struct _cef_task_post_int {
	cef_task_t task;
	unsigned int ref_count;
	cef_v8value_t* func;
	cef_v8context_t* ctx;
} cef_task_post_int;

void CEF_CALLBACK exec(struct _cef_task_t* self) {
	auto i = cef_v8value_create_int(233);
	cef_v8value_t* arg[1];
	arg[0] = i;
	auto ctx = ((_cef_task_post_int*)self)->ctx;
	ctx->enter(ctx);
	auto ret = ((_cef_task_post_int*)self)->func->execute_function(((_cef_task_post_int*)self)->func, nullptr, 1, arg);
	ctx->exit(ctx);
}

char* testApi(void** args) {
	cef_v8value_t* val = *((cef_v8value_t**)(args[0]));
	std::string str = "abab";

	char* cstr = new char[str.length() + 1];
	strcpy_s(cstr, str.length() + 1, str.c_str());
	auto ctx = cef_v8context_get_current_context();

	new std::thread([=]() {
		Sleep(2333);
	auto runner = ctx->get_task_runner(ctx);

	cef_task_post_int* task = (cef_task_post_int*)calloc(1, sizeof(cef_task_post_int));
	task->func = val;
	task->ctx = ctx;
	task->task.base.size = sizeof(cef_task_t);

	((cef_task_t*)task)->execute = exec;
	runner->post_task(runner, (cef_task_t*)task);

		});

	return cstr;
}