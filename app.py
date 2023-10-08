import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from flask import Flask, request, render_template
import re

flask_app = Flask(__name__)

def generate_response(model, tokenizer, prompt, max_length=100, temperature=0.1, k=50):
    input_ids = tokenizer.encode(prompt, return_tensors="pt")
    
    attention_mask = torch.ones_like(input_ids)
    pad_token_id = tokenizer.eos_token_id

    output = model.generate(
        input_ids,
        max_length=max_length,
        num_return_sequences=1,
        attention_mask=attention_mask,
        pad_token_id=pad_token_id,
        temperature=temperature,
        top_k=k
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)

def extract_sentences(text):
    sentences = re.split(r'(?<=[.!?])+', text)
    if len(sentences)>=3:
        return sentences[1] + ' ' + sentences[2]
    else:
        return None


model_path = "./model"
my_chat_model = GPT2LMHeadModel.from_pretrained(model_path)
my_chat_tokenizer = GPT2Tokenizer.from_pretrained(model_path)

prompt = input()
print("Bot is thinking")
response = generate_response(my_chat_model, my_chat_tokenizer, prompt, max_length=100)
short_resonse = extract_sentences(response)

if __name__ == "__main__":
    flask_app.run(debug=True)