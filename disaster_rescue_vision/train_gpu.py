from ultralytics import YOLO

def main():
    # 1. 直接加载中断前最后一次保存的权重 (last.pt)
    # 请确认这个路径下存在 last.pt 文件
    model = YOLO('runs/detect/train_fire_gpu_final2/weights/last.pt') 

    # 2. 开启断点续训
    # resume=True 会自动读取之前的参数（包括 epochs=100 等配置）继续接着跑
    results = model.train(resume=True)

if __name__ == '__main__':
    main()