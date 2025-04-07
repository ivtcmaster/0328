async function sendRequest() {
  const userInput = document.getElementById("userInput").value.trim();
  
  if (!userInput) {
    document.getElementById("response").innerText = "請輸入一些文字";
    return;
  }

  document.getElementById("response").innerText = "宇智波一族的血輪眼載入中...";

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "phi4:latest", prompt: userInput })
    });

    if (!response.ok) {
      throw new Error(`伺服器回應失敗，狀態碼: ${response.status}`);
    }

    // 解析流式回應
    const reader = response.body.getReader();
    let decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;  // 當流結束時，跳出迴圈

      let chunk = decoder.decode(value);
      
      try {
        let json = JSON.parse(chunk);
        fullResponse += json.response;  // 累加 AI 回應
        document.getElementById("response").innerText = fullResponse;
      } catch (err) {
        console.error("JSON 解析錯誤:", err);
      }
    }

  } catch (error) {
    console.error("錯誤:", error);
    document.getElementById("response").innerText = "無法連接伺服器，請稍後再試";
  }
}
