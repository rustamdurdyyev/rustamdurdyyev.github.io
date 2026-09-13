---
date: "2026-09-13"
description: "An MNIST model-combination experiment comparing split training, prediction ensembles, and parameter-level merging."
featuredImage: "/images/merge_hor.png"
cardLabel: "AI"
title: "ShardMerge Lab: Combining MNIST Models Trained on Dataset Splits"
---

# ShardMerge Lab: Combining MNIST Models Trained on Dataset Splits

## Abstract

This article describes a complete MNIST experiment for studying whether neural networks trained on separate data shards can be combined into stronger predictors. The project starts with a centralized full-data baseline, searches for a practical multilayer perceptron architecture, trains models on IID and non-IID dataset splits, evaluates several model-combination methods, and analyzes the final accuracy, macro precision, macro recall, macro F1, training time, inference latency, and confusion matrices. The main result is clear: prediction-level ensembles are the most reliable way to recover performance from split models, while direct parameter merging is cheaper at inference time but much less reliable when independently trained models are not aligned.

## 1. Introduction

Modern machine-learning systems are often trained in settings where the data is naturally divided. A hospital may have one dataset per clinic, a company may have one dataset per device group, and a distributed learning system may have one local model per client. In those cases, a practical question appears: can we train several smaller local models and then combine them into a single useful result?

The simplest answer is to keep every model and combine their predictions. This idea is related to classical ensemble learning and bagging, where multiple predictors vote or average their outputs to improve stability and generalization [2]. A second answer is to merge the model parameters directly, which is attractive because the final system can keep the inference cost of one model instead of many. This direction is related to federated averaging [3], model soups [9], Fisher-weighted merging [10], task arithmetic [12], TIES merging [13], and neuron or permutation alignment methods [6, 7, 8, 11, 14].

This also connects the project to model compression. The practical reason to combine or compress models is not only academic accuracy; it is deployment cost. Real applications often need lower memory use, faster inference, lower cloud cost, and better edge-device performance. The compression guide used in this project frames this broader motivation: organizations want models that are easier to deploy, cheaper to run, and small enough for mobile, embedded, or privacy-sensitive settings [15].

This project uses MNIST as the controlled starting point. MNIST is not a difficult modern vision benchmark, but that is an advantage for this stage of the research. It is small, easy to inspect visually, well supported by PyTorch, and stable enough that training differences can be studied without spending most of the work on data engineering [1]. The goal is not to claim state-of-the-art MNIST accuracy. The goal is to build a repeatable experiment that shows what happens when the same model family is trained on increasingly smaller dataset parts and then combined.

The research question is:

> Can local models trained on different MNIST shards be combined so that the combined result improves over the individual split models and approaches a centralized full-data model?

The project compares two data regimes. In the IID setting, each shard is randomly sampled so that every split has roughly the same digit distribution as the whole dataset. In the non-IID setting, shards have narrower and less balanced class coverage. This distinction matters because non-IID data is closer to many real distributed-learning problems and is usually much harder for direct model averaging.

## 2. Dataset

The dataset is MNIST: 60,000 training images, 10,000 test images, ten digit classes from 0 to 9, and grayscale images of size 1 x 28 x 28 [1]. In this project the data was loaded through `torchvision.datasets.MNIST`. The PyTorch downloader used the MNIST mirror at `https://ossci-datasets.s3.amazonaws.com/mnist/`, with the original MNIST website `https://yann.lecun.org/exdb/mnist/` as the dataset reference.

MNIST is a good first dataset for this work because every training run is fast, the data can be visualized directly, and the benchmark is familiar enough that strange results are easy to notice. Larger image datasets can be added later, but MNIST is enough to validate the experiment pipeline.

A second reason for starting with MNIST is that it separates the combination problem from the dataset problem. If a method cannot behave sensibly on MNIST, it is unlikely to be reliable on a harder dataset such as CIFAR-10. At the same time, MNIST is easy enough that the results must be interpreted carefully. A high MNIST accuracy does not prove that a method is ready for production; it proves that the experimental workflow is working and that the method deserves a harder follow-up test.

The project uses the fixed MNIST test set for evaluation. This makes all methods comparable because every centralized model, split model, ensemble, and merged model is evaluated against the same 10,000 examples. Macro precision, macro recall, and macro F1 are included because accuracy alone can hide class imbalance problems, especially in non-IID experiments.

## 3. Experimental Design

The project was implemented step by step:

1. Load and verify MNIST.
2. Visualize sample images to confirm that the data is correct.
3. Create IID and non-IID train splits for k = 1, 2, 3, 4, 5, 10, 20, 30, 40, and 50.
4. Train a centralized model on the full training dataset.
5. Search for the best practical MLP architecture and normalization setting.
6. Train one model per split using the selected architecture.
7. Combine the split models with prediction-level and parameter-level methods.
8. Compare accuracy, macro precision, macro recall, macro F1, training time, inference latency, model size, and confusion matrices.
9. Collect all results in a single experiment table and produce this article.

The centralized model is used as the full-data reference. It is not expected that split models will always match it, because each split model sees less data. The important measurement is how much performance is recovered by combination.

The split counts were chosen to show both gentle and severe fragmentation. The small values k = 1, 2, 3, 4, and 5 show what happens when the dataset is divided into only a few large local datasets. The larger values k = 10, 20, 30, 40, and 50 show what happens when each local model receives much less data. This is important because the behavior is not linear: splitting from 1 to 2 is not the same kind of difficulty as splitting from 20 to 50, especially under non-IID class distributions.

For IID splits, every local model should still see a reasonable sample of every digit. For non-IID splits, local models can become specialists. A specialist model may be very confident on the digits it saw, but weak on missing or rare digits. This is why the non-IID experiment is a better stress test for combination methods.

## 4. Why This Is Also a Compression Problem

A prediction ensemble can improve accuracy, but it is not compressed: if there are 50 split models, the system may need to store and run 50 models. A single merged model is more attractive for deployment because it keeps inference close to the cost of one model. This is the same practical pressure described in the AI model compression guide: smaller and faster models matter for edge AI, mobile apps, real-time systems, and cloud-cost reduction [15].

The market guide is useful here because it reminds us that model quality is not only a research metric. In a real application, a model may need to run on a phone, an embedded device, a web browser, or a low-cost server. In those places, memory, latency, and power use matter. An ensemble that improves accuracy by a few points may still be unattractive if it multiplies inference time by 20 or 50.

Classic compression techniques are related but different from the merging experiment here:

| technique | short explanation |
| --- | --- |
| Quantization | Stores weights or activations with fewer bits, such as FP32 to INT8. It reduces memory and can improve inference speed. |
| Pruning | Removes unimportant weights, neurons, or channels. Structured pruning is especially useful when hardware can skip the removed computation. |
| Knowledge distillation | Trains a smaller student model to imitate a larger teacher or ensemble. It is a natural future step for replacing a multi-model ensemble with one smaller model. |
| Quantization-aware training | Trains while simulating quantized arithmetic, so the final compressed model loses less accuracy after deployment. |

In this project, the main experiment is model combination, not quantization or pruning. However, the final conclusion still uses the compression perspective: if an ensemble gives the best accuracy but is too expensive, the next step is to distill, align, quantize, or otherwise compress the combined behavior into a smaller deployable model.

## 5. Architecture Search

Before training all split models, the project compared several MLP architectures with and without normalization. The selected model was the best balance between accuracy, macro F1, and runtime.

The tested base models were deliberately simple. A one-hidden-layer MLP is fast and easy to compare. A two-hidden-layer MLP can learn a richer hierarchy while staying small. A three-hidden-layer MLP has more capacity, but it can be slower and is not automatically better on MNIST. Normalization was tested because it can stabilize training and improve final generalization, although it may add a small runtime cost.

The chosen MLP is not intended to be the best possible MNIST classifier. A convolutional neural network would usually be a stronger image model because it uses spatial structure. However, an MLP is a good first model for merging research because its layers are simple, its parameters are easy to inspect, and neuron-matching methods are easier to implement than for a larger CNN. This makes the experiment easier to understand and easier to reproduce.

The selected architecture was `784 -> 256 -> 128 -> 10` with normalization. It reached accuracy `0.9762`, macro precision `0.9762`, macro recall `0.9759`, macro F1 `0.9760`, training time `7.41s`, inference latency `0.0314 ms/sample`, and `235146` trainable parameters.

![Architecture search macro F1](./article_assets/architecture_search_macro_f1.png)

[Open figure](./article_assets/architecture_search_macro_f1.png)

| hidden sizes | normalization | accuracy | macro F1 | train sec | latency ms/sample | params |
| --- | --- | --- | --- | --- | --- | --- |
| 256-128 | True | 0.9762 | 0.9760 | 7.41 | 0.0314 | 235146 |
| 256 | True | 0.9746 | 0.9743 | 6.76 | 0.0290 | 203530 |
| 256-128-64 | True | 0.9738 | 0.9736 | 7.11 | 0.0289 | 242762 |
| 128 | True | 0.9729 | 0.9727 | 6.68 | 0.0285 | 101770 |
| 256-128 | False | 0.9721 | 0.9719 | 4.10 | 0.0160 | 235146 |
| 256 | False | 0.9707 | 0.9704 | 4.65 | 0.0180 | 203530 |
| 256-128-64 | False | 0.9674 | 0.9672 | 4.06 | 0.0157 | 242762 |
| 64 | True | 0.9666 | 0.9664 | 6.86 | 0.0297 | 50890 |
| 128 | False | 0.9621 | 0.9618 | 4.64 | 0.0181 | 101770 |
| 64 | False | 0.9557 | 0.9552 | 4.18 | 0.0159 | 50890 |

## 6. Split Training Results

After selecting the architecture, the same model was trained separately on every IID and non-IID shard. The table below reports the mean result across the individual split models before any combination is applied. This is the no-combination reference used to calculate improvement.

| split type | k | accuracy mean | accuracy std | macro F1 mean | macro F1 std | total train sec |
| --- | --- | --- | --- | --- | --- | --- |
| iid | 1 | 0.9737 | 0.0000 | 0.9734 | 0.0000 | 6.90 |
| iid | 2 | 0.9684 | 0.0009 | 0.9681 | 0.0011 | 6.88 |
| iid | 3 | 0.9577 | 0.0026 | 0.9573 | 0.0026 | 6.72 |
| iid | 4 | 0.9517 | 0.0014 | 0.9513 | 0.0014 | 6.72 |
| iid | 5 | 0.9451 | 0.0031 | 0.9447 | 0.0031 | 6.87 |
| iid | 10 | 0.9226 | 0.0032 | 0.9217 | 0.0031 | 6.76 |
| iid | 20 | 0.9008 | 0.0054 | 0.8995 | 0.0056 | 6.88 |
| iid | 30 | 0.8852 | 0.0053 | 0.8836 | 0.0056 | 7.03 |
| iid | 40 | 0.8700 | 0.0083 | 0.8682 | 0.0082 | 6.97 |
| iid | 50 | 0.8577 | 0.0134 | 0.8552 | 0.0152 | 6.95 |
| non-iid | 1 | 0.9741 | 0.0000 | 0.9738 | 0.0000 | 6.79 |
| non-iid | 2 | 0.5339 | 0.0352 | 0.3942 | 0.0638 | 6.81 |
| non-iid | 3 | 0.3927 | 0.0157 | 0.2356 | 0.0038 | 7.00 |
| non-iid | 4 | 0.3213 | 0.0387 | 0.1689 | 0.0405 | 6.77 |
| non-iid | 5 | 0.2607 | 0.0445 | 0.1251 | 0.0398 | 6.73 |
| non-iid | 10 | 0.1807 | 0.0416 | 0.0703 | 0.0315 | 6.91 |
| non-iid | 20 | 0.1396 | 0.0478 | 0.0423 | 0.0292 | 6.81 |
| non-iid | 30 | 0.1245 | 0.0421 | 0.0336 | 0.0262 | 7.09 |
| non-iid | 40 | 0.1187 | 0.0383 | 0.0297 | 0.0238 | 6.95 |
| non-iid | 50 | 0.1155 | 0.0353 | 0.0275 | 0.0209 | 6.98 |

The IID trend is gradual: more splits means less data per model, so average accuracy decreases. The non-IID trend is much sharper because some local models see only a narrow part of the digit distribution. This is why non-IID splitting is the more difficult and more informative part of the experiment.

The total training time column should be read carefully. For a fixed number of epochs, the total amount of training data processed across all split models is approximately the same as the full dataset, but the training is divided across many separate models. In a real distributed setting this work could happen in parallel on different machines. In this local experiment it was measured as the total observed training time so that the cost remains visible.

The standard deviation columns show whether split models behave similarly. In IID splits, the standard deviation stays relatively small because each shard is a fair sample of the same task. In non-IID splits, the standard deviation is much larger because one local model may see easier or more complete class coverage than another.

## 7. Models and Combination Methods Explained

The project implemented one centralized model, many split models, and eleven combination methods. Four methods combine predictions at inference time: probability ensemble, logit ensemble, majority vote, and confidence vote. These methods usually preserve accuracy better because every local model remains available. Seven methods create one merged model or one merged parameter set: uniform weight average, sample-weighted average, top-half model soup, task arithmetic, TIES merging, Fisher-weighted averaging, and weight-matching average.

| model or method | short explanation |
| --- | --- |
| Centralized MLP | One neural network trained on the full MNIST training set. This is the main full-data reference for accuracy and runtime. |
| Split MLP | The same MLP architecture trained on only one dataset shard. These models show how much performance is lost when each model sees less data. |
| Probability ensemble | Runs all split models and averages their softmax probabilities. It is usually strong because every model contributes calibrated class probabilities. |
| Logit ensemble | Runs all split models and averages their raw class scores before softmax. It can preserve confidence information that probability averaging smooths away. |
| Majority vote | Each model predicts one class, and the most common class wins. This is simple and robust, but it ignores how confident each model is. |
| Confidence vote | Each model predicts one class with a confidence score, and the most confident prediction can dominate. It helped strongly in several non-IID settings. |
| Uniform weight average | Creates one model by averaging matching parameters equally. It is cheap at inference time, but fragile when independently trained neurons are not aligned. |
| Sample-weighted average | Creates one model by averaging parameters with weights based on shard sample counts. This is related to federated averaging. |
| Top-half model soup | Averages only the better half of local models. The idea comes from model soups: merge compatible good models while avoiding weaker ones. |
| Task arithmetic | Treats each trained model as a parameter change from a base model and combines those changes. It is more natural when models share the same initialization. |
| TIES merging | Trims small parameter changes and resolves sign conflicts before merging. It tries to reduce interference when many task vectors disagree. |
| Fisher-weighted average | Weights parameters by estimated importance, so important parameters have more influence in the merged model. |
| Weight-matching average | Aligns hidden units before averaging. This addresses permutation symmetry, where two networks can learn similar features in different neuron orders. |

The methods are connected to prior work as follows. Prediction averaging follows the ensemble and bagging tradition [2]. Sample-weighted averaging is related to federated averaging [3]. Model soups motivate simple weight averaging of compatible models [9]. Fisher-weighted averaging uses parameter importance when merging [10]. Task arithmetic and TIES merging treat trained models as parameter updates that can be added, trimmed, or sign-resolved [12, 13]. Weight matching and re-basing address the fact that hidden units can be permuted, so two networks with similar functions may not have directly matching neuron order [6, 7, 8, 11, 14].

A key lesson from the literature is that prediction combination and weight combination solve different problems. Prediction combination asks, `what do the models predict for this image?` Weight combination asks, `can these independently trained parameter tensors be placed into one shared model?` The second problem is harder because neural networks have symmetries: hidden units can swap positions without changing the function. If two models learn similar features in different neuron orders, plain averaging can destroy useful structure.

This is why the article separates ensemble methods from merging methods. Ensemble methods are larger but robust. Merging methods are efficient but need stronger assumptions. They work best when models share a common initialization, are trained along compatible paths, or are aligned before averaging.

![Accuracy before and after combination](./article_assets/accuracy_before_after_combination.png)

[Open figure](./article_assets/accuracy_before_after_combination.png)

![Best combination macro F1 improvement](./article_assets/best_combination_f1_improvement.png)

[Open figure](./article_assets/best_combination_f1_improvement.png)

## 8. Best Combination Results

The table below shows the best combination method for each split count and data regime. The improvement column compares the best combined result with the mean no-combination split-model result for the same split setting.

| split type | k | best method | accuracy | macro precision | macro recall | macro F1 | F1 improvement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iid | 1 | probability_ensemble | 0.9737 | 0.9736 | 0.9736 | 0.9734 | +0.0000 |
| iid | 2 | logit_ensemble | 0.9730 | 0.9730 | 0.9728 | 0.9728 | +0.0047 |
| iid | 3 | probability_ensemble | 0.9662 | 0.9662 | 0.9658 | 0.9659 | +0.0086 |
| iid | 4 | probability_ensemble | 0.9615 | 0.9614 | 0.9611 | 0.9612 | +0.0099 |
| iid | 5 | logit_ensemble | 0.9551 | 0.9549 | 0.9548 | 0.9547 | +0.0100 |
| iid | 10 | majority_vote | 0.9367 | 0.9363 | 0.9359 | 0.9359 | +0.0142 |
| iid | 20 | logit_ensemble | 0.9183 | 0.9176 | 0.9174 | 0.9171 | +0.0177 |
| iid | 30 | logit_ensemble | 0.9085 | 0.9075 | 0.9073 | 0.9072 | +0.0236 |
| iid | 40 | probability_ensemble | 0.9005 | 0.8995 | 0.8993 | 0.8991 | +0.0309 |
| iid | 50 | logit_ensemble | 0.8919 | 0.8909 | 0.8905 | 0.8903 | +0.0351 |
| non-iid | 1 | probability_ensemble | 0.9741 | 0.9744 | 0.9737 | 0.9738 | +0.0000 |
| non-iid | 2 | confidence_vote | 0.9155 | 0.9195 | 0.9142 | 0.9143 | +0.5201 |
| non-iid | 3 | confidence_vote | 0.8859 | 0.8950 | 0.8859 | 0.8851 | +0.6495 |
| non-iid | 4 | confidence_vote | 0.7783 | 0.8096 | 0.7783 | 0.7716 | +0.6027 |
| non-iid | 5 | confidence_vote | 0.6306 | 0.7196 | 0.6270 | 0.5795 | +0.4543 |
| non-iid | 10 | probability_ensemble | 0.4827 | 0.3730 | 0.4662 | 0.3550 | +0.2847 |
| non-iid | 20 | probability_ensemble | 0.4562 | 0.2976 | 0.4383 | 0.3203 | +0.2780 |
| non-iid | 30 | logit_ensemble | 0.5651 | 0.5335 | 0.5521 | 0.4610 | +0.4273 |
| non-iid | 40 | logit_ensemble | 0.5055 | 0.5864 | 0.4961 | 0.4479 | +0.4182 |
| non-iid | 50 | logit_ensemble | 0.5384 | 0.4874 | 0.5323 | 0.4598 | +0.4322 |

For IID splits, the best combination stays close to the full-data baseline at small split counts and declines smoothly as k grows. For non-IID splits, combination is still useful, but the gap is much larger. At high non-IID split counts, prediction-level ensembles such as probability ensemble and logit ensemble are the most dependable methods because they can pool information across specialized local models.

The most important comparison is not only the final accuracy; it is the difference between no combination and the best combined result. In IID experiments, the improvement grows gradually as the number of splits increases. In non-IID experiments, the improvement can be very large because the average single split model is weak. Combining predictions lets the system recover class knowledge distributed across local models.

The non-IID results also show why a single local model is not enough. If a local model was trained on a narrow digit distribution, it can fail badly on unseen digits. A combined system has access to multiple specialists, so it can cover more of the test distribution. This is especially visible for confidence vote at small non-IID split counts and for logit or probability ensemble at larger split counts.

## 9. Error Analysis

The project also generated per-class metrics and confusion matrices. The centralized full-data model has strong performance across all digits, with the weakest recall on digits such as 8, 3, and 4. The non-IID combined models show a different pattern: mistakes increase when some local models have limited exposure to specific digits. The confusion matrices are useful because they show which digits are being confused, not only how many total predictions are wrong.

Representative confusion matrices and per-class recall plots were generated in `outputs/plots/confusion_matrices/` and `outputs/plots/`. These figures are useful for checking whether a method fails evenly across all digits or mainly fails on a few classes.

A confusion matrix should be read row by row. Each row is the true digit, and each column is the predicted digit. A strong model has most values on the diagonal because the predicted digit matches the true digit. Off-diagonal values show mistakes. For example, if row 8 has many values under column 3, then true digit 8 is often being predicted as digit 3.

In this project, confusion matrices are more informative than accuracy alone for non-IID splits. A model can have acceptable total accuracy while still failing badly on one or two classes. For a publishable experiment, this matters because it shows whether the method is balanced across all digits or only strong on the classes that dominate the local shards.

![Centralized baseline confusion matrix](./article_assets/centralized_baseline.png)

[Open figure](./article_assets/centralized_baseline.png)

![Non-IID k=50 logit ensemble confusion matrix](./article_assets/non_iid_k50_logit_ensemble.png)

[Open figure](./article_assets/non_iid_k50_logit_ensemble.png)

## 10. Runtime and Practical Tradeoffs

Accuracy is not the only result that matters. Training time and inference cost are also important. Prediction-level ensembles are strong, but they require running several models during inference. Parameter-level merging creates one model, so inference is cheaper, but the current direct merging methods did not consistently match ensemble accuracy.

This creates the main tradeoff of the project: use an ensemble when accuracy is the priority, and investigate stronger alignment or shared-initialization strategies before relying on a single merged model for efficiency.

From a deployment point of view, the best research method is not always the best product method. A 50-model ensemble may be acceptable for offline analysis, but it may be too slow for a phone or browser application. A single merged model may be worse in accuracy today, but it is closer to what an edge deployment needs. This is why compression methods such as distillation and quantization are natural follow-up work.

The ideal practical pipeline would train local models, combine their knowledge with an accurate ensemble, distill that ensemble into one student model, and then quantize or prune the student model for deployment. This project implements the first half of that pipeline and leaves the compression of the final predictor as future work.

## 11. Conclusion

The project shows that model combination can improve over individual split models, but the strength of the improvement depends heavily on how the data is split. IID splits are forgiving, and several combination methods recover useful performance. Non-IID splits are much harder; individual split models become weak because they do not see a balanced digit distribution, and direct weight merging can fail when independently trained networks are not aligned.

The best practical result in this project is prediction-level ensembling. It is accurate and robust, especially for non-IID data, but it has higher inference cost because multiple models must run. Single-model merging remains attractive for efficiency, but it needs stronger alignment methods, shared initialization, or more advanced merging logic before it can be trusted as the main method in this experiment.

The final recommendation is:

| decision | recommended model or method | reason |
| --- | --- | --- |
| Best accuracy choice | Logit ensemble or probability ensemble | These methods kept the strongest overall accuracy because they preserve information from every split model. |
| Best non-IID small-k choice | Confidence vote | For k = 2 to 5 non-IID splits, confidence vote recovered a large amount of lost performance. |
| Best single-model direction | Weight matching, Fisher merging, or TIES with better alignment | Single merged models are efficient, but the current simple versions were not as reliable as ensembles. |
| Best base architecture | MLP 784 -> 256 -> 128 -> 10 with normalization | This was the best tested architecture by macro F1 while still training quickly on MNIST. |
| Best future compression step | Distill the best ensemble into one student model | This keeps the benefit of ensemble predictions while moving toward one deployable model. |

In simple terms, the best model to combine in this project is the normalized two-hidden-layer MLP `784 -> 256 -> 128 -> 10`. It is the best tested base architecture and should be used for the split models. The best way to combine those split models for accuracy is a prediction-level ensemble, especially logit ensemble or probability ensemble. For non-IID splits with small k, confidence vote is also very strong. If the goal is one small deployable model, the current result says not to trust plain averaging alone; use alignment-aware merging or distill the ensemble into one student model.

A good next research step would be to repeat the same pipeline on Fashion-MNIST, KMNIST, EMNIST, or CIFAR-10. That would test whether the findings still hold when the dataset is more visually complex. For this project, MNIST is kept as the controlled dataset so the workflow and comparison logic stay clear.

## Reproducibility

Main result files:

- `results/architecture_search.csv`
- `results/split_model_summary.csv`
- `results/combination_results.csv`
- `results/error_analysis/per_class_metrics.csv`
- `results/error_analysis/best_method_by_split.csv`
- `results/experiment_results.csv`

Main commands:

```bash
python main.py
python visualize_mnist.py
python prepare_splits.py
python train_baseline.py --hidden-sizes 256,128
python run_architecture_search.py
python train_split_models.py
python combine_models.py
python analyze_errors.py
python track_experiments.py
python generate_article_report.py
```

## References

1. Yann LeCun, Corinna Cortes, and Christopher Burges. *The MNIST Database*. https://yann.lecun.org/exdb/mnist/
2. Leo Breiman. *Bagging Predictors*. https://doi.org/10.1007/BF00058655
3. Brendan McMahan et al. *Communication-Efficient Learning of Deep Networks from Decentralized Data*. https://proceedings.mlr.press/v54/mcmahan17a.html
4. Timur Garipov et al. *Loss Surfaces, Mode Connectivity, and Fast Ensembling of DNNs*. https://papers.nips.cc/paper/2018/hash/be3087e74e9100d4bc4c6268cdbe8456-Abstract.html
5. Pavel Izmailov et al. *Averaging Weights Leads to Wider Optima and Better Generalization*. https://mlanthology.org/uai/2018/izmailov2018uai-averaging/
6. Mikhail Yurochkin et al. *Bayesian Nonparametric Federated Learning of Neural Networks*. https://proceedings.mlr.press/v97/yurochkin19a.html
7. Hongyi Wang et al. *Federated Learning with Matched Averaging*. https://research.ibm.com/publications/federated-learning-with-matched-averaging
8. Sidak Pal Singh and Martin Jaggi. *Model Fusion via Optimal Transport*. https://papers.nips.cc/paper_files/paper/2020/hash/fb2697869f56484404c8ceee2985b01d-Abstract.html
9. Mitchell Wortsman et al. *Model soups: averaging weights of multiple fine-tuned models improves accuracy without increasing inference time*. https://proceedings.mlr.press/v162/wortsman22a.html
10. Michael Matena and Colin Raffel. *Merging Models with Fisher-Weighted Averaging*. https://proceedings.neurips.cc/paper_files/paper/2022/hash/70c26937fbf3d4600b69a129031b66ec-Abstract-Conference.html
11. Samuel Ainsworth et al. *Git Re-Basin: Merging Models modulo Permutation Symmetries*. https://arxiv.org/abs/2209.04836
12. Gabriel Ilharco et al. *Editing Models with Task Arithmetic*. https://mlanthology.org/iclr/2023/ilharco2023iclr-editing/
13. Prateek Yadav et al. *TIES-Merging: Resolving Interference When Merging Models*. https://proceedings.neurips.cc/paper_files/paper/2023/hash/1644c9af28ab7916874f6fd6228a9bcf-Abstract-Conference.html
14. Akira Ito et al. *Linear Mode Connectivity between Multiple Models modulo Permutation Symmetries*. https://proceedings.mlr.press/v267/ito25a.html
15. Project note. *AI Model Compression: Complete Market & Technical Guide*. AI_Model_Compression_Complete_Guide.md
