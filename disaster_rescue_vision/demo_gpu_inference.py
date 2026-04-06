import cv2
import json
from ultralytics import YOLO

def run_inference(image_path, model_path='runs/detect/train_fire_gpu_final/weights/best.pt'):
    print("🚀 正在加载 YOLOv8 模型 (纯 GPU 模式)...")
    # 加载模型，明确指定推理由 GPU 执行
    model = YOLO(model_path)
    
    # 执行推理
    results = model(image_path, device=0)
    
    # 解析结果并生成大唐杯要求的 JSON 格式
    detection_data = {"detections": []}
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            # 获取类别 ID 和置信度
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            class_name = model.names[cls_id]
            
            # 提取边界框坐标 (xyxy 格式)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            
            # 计算中心坐标 (5G传输核心需求)
            center_x = (x1 + x2) / 2
            center_y = (y1 + y2) / 2
            
            detection_data["detections"].append({
                "class": class_name,
                "confidence": round(conf, 3),
                "center_x": round(center_x, 2),
                "center_y": round(center_y, 2)
            })
            
    # 输出 JSON 结果
    json_output = json.dumps(detection_data, indent=4)
    print("\n📦 准备通过 5G 传输的 JSON 数据:")
    print(json_output)
    
    # 保存结果到文件
    with open('result.json', 'w') as f:
        f.write(json_output)
        
    # 可视化并保存图片
    res_img = results[0].plot()
    cv2.imwrite('inference_result.jpg', res_img)
    print("📸 带有检测框的图像已保存至 inference_result.jpg")

if __name__ == '__main__':
    # 替换为你的测试图片路径
    test_image = 'disaster_dataset/images/val/fire_001.jpg'
    run_inference(test_image)