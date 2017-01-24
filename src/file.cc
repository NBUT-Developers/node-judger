#include <nan.h>
#include <string>
#include <stdio.h>

namespace NodeJudger {

class FileJudgerWorker : public Nan::AsyncWorker {
public:
    FileJudgerWorker(Nan::Callback* callback,
            const char* output,
            const char* _std) :
        AsyncWorker(callback),
        output(output),
        _std(_std)
    {
        result[0] = 0;
    }

    void Execute()
    {
        FILE *file_std = fopen(_std.c_str(), "r");
        FILE *file_output = fopen(output.c_str(), "r");

        if(file_std == NULL || file_output == NULL)
        {
            strcpy(result, "No output file or no std output file.");
            return;
        }

        char tmp1, tmp2;
        bool wa = false;
        bool pe = true;

        while(!feof(file_std))
        {
            tmp1 = fgetc(file_std);
            tmp2 = fgetc(file_output);

            // windows \r or no \r
            while(tmp1 == '\r') tmp1 = fgetc(file_std);
            while(tmp2 == '\r') tmp2 = fgetc(file_output);

            if(tmp1 != tmp2)
            {
                wa = true;
                break;
            }
        }

        if(!wa)
        {
            fclose(file_std);
            fclose(file_output);
            strcpy(result, "ACCEPTED");
            return;
        }

        fseek(file_std, 0, SEEK_SET);
        fseek(file_output, 0, SEEK_SET);

        while(!feof(file_std))
        {
            tmp1 = fgetc(file_std);
            tmp2 = fgetc(file_output);

            while(!feof(file_std) && (tmp1 == ' ' || tmp1 == '\n' || tmp1 == '\r'))
            {
                tmp1 = fgetc(file_std);
            }

            while(!feof(file_output) && (tmp2 == ' ' || tmp2 == '\n' || tmp2 == '\r'))
            {
                tmp2 = fgetc(file_output);
            }

            if(tmp1 != tmp2)
            {
                pe = false;
                break;
            }
        }

        fclose(file_std);
        fclose(file_output);

        if(!pe)
        {
            strcpy(result, "WRONG_ANSWER");
        }
        else
        {
            strcpy(result, "PRESENTATION_ERROR");
        }
    }

    void HandleOKCallback()
    {
        Nan::HandleScope scope;

        v8::Local<v8::Value> argv[2] = {
            Nan::Undefined(),
            Nan::New<v8::String>(result).ToLocalChecked()
        };
        callback->Call(2, argv);
    }

private:
    std::string output;
    std::string _std;

    char result[256];
};

NAN_METHOD(JudgeFile)
{
    v8::String::Utf8Value v8_output(info[0]->ToString());
    v8::String::Utf8Value v8_std(info[1]->ToString());
    Nan::Callback* callback = new Nan::Callback(info[2].As<v8::Function>());

    Nan::AsyncQueueWorker(new FileJudgerWorker(callback,
            *v8_output, 
            *v8_std));
}

};

void InitNodeJudgerFile(v8::Local<v8::Object> exports)
{
    Nan::Set(exports,
            Nan::New<v8::String>("judge").ToLocalChecked(),
            Nan::GetFunction(Nan::New<v8::FunctionTemplate>(NodeJudger::JudgeFile)).ToLocalChecked());
}

NODE_MODULE(file, InitNodeJudgerFile);
