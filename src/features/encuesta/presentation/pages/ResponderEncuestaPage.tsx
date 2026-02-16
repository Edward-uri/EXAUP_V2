import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import {
  PublicSurveyService,
  type PublicSurvey,
  type PublicQuestion,
  type PublicQuestionOption
} from "../../data/PublicSurveyService";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FaceFrownIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useAlert } from "../../../../shared/components/Alert";

type AnswerValue = string | string[] | boolean | undefined;
type FieldErrors = Record<string, string>;

type PageStatus = "idle" | "forbidden" | "not-found" | "answered";

const LIKERT_VALUES = ["1", "2", "3", "4", "5"];

export default function ResponderEncuestaPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const { success, error: alertError, info } = useAlert();

  const [survey, setSurvey] = useState<PublicSurvey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, AnswerValue>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<PageStatus>("idle");

  useEffect(() => {
    if (!uuid) return;

    const loadSurvey = async () => {
      setLoading(true);
      setStatus("idle");
      setFieldErrors({});

      try {
        const data = await PublicSurveyService.getByUuid(uuid);
        setSurvey(data);
      } catch (err: any) {
        const code = err?.response?.status;
        if (code === 403) {
          setStatus("forbidden");
        } else if (code === 404) {
          setStatus("not-found");
        } else if (code === 409) {
          setStatus("answered");
        } else {
          alertError("No pudimos cargar la encuesta", "Intenta nuevamente en unos minutos.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [alertError, uuid]);

  const sortedQuestions = useMemo(() => {
    if (!survey) return [] as PublicQuestion[];
    return [...survey.formulario.preguntas].sort((a, b) => a.orden - b.orden);
  }, [survey]);

  const hasAnswer = (value: AnswerValue): boolean => {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "boolean") return true;
    return String(value).trim().length > 0;
  };

  const formatAnswer = (value: AnswerValue): string => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Si" : "No";
    return value === undefined || value === null ? "" : String(value);
  };

  const handleChange = (questionId: string, value: AnswerValue) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const validateRequired = (): boolean => {
    const errors: FieldErrors = {};
    sortedQuestions.forEach((q) => {
      if (q.es_obligatoria && !hasAnswer(responses[q.id])) {
        errors[q.id] = "Esta pregunta es obligatoria";
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!survey || !uuid) return;

    if (!validateRequired()) return;

    const payload = Object.entries(responses).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        acc[key] = formatAnswer(value);
        return acc;
      },
      {}
    );

    setSubmitLoading(true);
    try {
      await PublicSurveyService.submit(uuid, payload);
      success("¡Gracias por responder!", "Tus respuestas fueron registradas.");
      setStatus("answered");
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 409) {
        setStatus("answered");
        info("Encuesta ya respondida", "Ya registramos tus respuestas anteriormente.");
      } else if (code === 403) {
        setStatus("forbidden");
      } else if (code === 404) {
        setStatus("not-found");
      } else {
        alertError("No pudimos enviar tus respuestas", "Intenta nuevamente.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderOptionLabel = (option: PublicQuestionOption, index: number) => {
    return option.texto || option.etiqueta || option.valor || `Opción ${index + 1}`;
  };

  const renderQuestionInput = (question: PublicQuestion) => {
    const tipo = question.tipo.toLowerCase();
    const value = responses[question.id];
    const disabled = status === "answered";
    const opciones = question.opciones || [];

    if (tipo.includes("abierta") || tipo.includes("texto")) {
      return (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => handleChange(question.id, e.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-sm bg-white"
          placeholder="Escribe tu respuesta"
          rows={3}
        />
      );
    }

    if (tipo.includes("boolean")) {
      return (
        <div className="flex gap-6">
          {["Si", "No"].map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={option}
                disabled={disabled}
                checked={value === option}
                onChange={() => handleChange(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (tipo.includes("likert")) {
      return (
        <div className="flex flex-wrap gap-3">
          {LIKERT_VALUES.map((option) => (
            <label
              key={option}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 hover:text-blue-600"
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                disabled={disabled}
                checked={value === option}
                onChange={() => handleChange(question.id, option)}
                className="sr-only"
              />
              <span className={`text-sm font-medium ${value === option ? "text-blue-600" : "text-gray-700"}`}>
                {option}
              </span>
              <span className="text-[11px] text-gray-400">{`${option}/5`}</span>
            </label>
          ))}
        </div>
      );
    }

    if (tipo.includes("múltiple") || tipo.includes("multiple")) {
      return (
        <div className="space-y-2">
          {opciones.map((opcion, idx) => (
            <label key={idx} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={renderOptionLabel(opcion, idx)}
                disabled={disabled}
                checked={value === renderOptionLabel(opcion, idx)}
                onChange={() => handleChange(question.id, renderOptionLabel(opcion, idx))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>{renderOptionLabel(opcion, idx)}</span>
            </label>
          ))}
        </div>
      );
    }

    if (tipo.includes("casilla") || tipo.includes("check")) {
      const selected = Array.isArray(value) ? value : [];
      const toggleOption = (label: string) => {
        if (selected.includes(label)) {
          handleChange(question.id, selected.filter((item) => item !== label));
        } else {
          handleChange(question.id, [...selected, label]);
        }
      };

      return (
        <div className="space-y-2">
          {opciones.map((opcion, idx) => {
            const label = renderOptionLabel(opcion, idx);
            return (
              <label key={idx} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  value={label}
                  disabled={disabled}
                  checked={selected.includes(label)}
                  onChange={() => toggleOption(label)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <textarea
        value={(value as string) || ""}
        onChange={(e) => handleChange(question.id, e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-sm bg-white"
        placeholder="Escribe tu respuesta"
        rows={3}
      />
    );
  };

  const renderStatusCard = () => {
    if (status === "forbidden") {
      return (
        <div className="max-w-xl mx-auto bg-white border border-amber-100 rounded-xl shadow-sm p-8 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Acceso revocado</h2>
          <p className="text-gray-600 mt-2">La encuesta ya no está disponible para ti.</p>
        </div>
      );
    }

    if (status === "not-found") {
      return (
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center">
          <FaceFrownIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Encuesta no encontrada</h2>
          <p className="text-gray-600 mt-2">Verifica que el enlace sea correcto.</p>
        </div>
      );
    }

    if (status === "answered") {
      return (
        <div className="max-w-xl mx-auto bg-white border border-green-100 rounded-xl shadow-sm p-8 text-center">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Encuesta respondida</h2>
          <p className="text-gray-600 mt-2">Gracias por tu tiempo. Tus respuestas ya fueron registradas.</p>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <ArrowPathIcon className="w-10 h-10 animate-spin text-blue-600" />
          <p>Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (!survey || status !== "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        {renderStatusCard()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Encuesta</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-1">
              {survey.titulo_encuesta}
            </h1>
            {survey.descripcion && <p className="text-gray-600 mt-3">{survey.descripcion}</p>}
            <p className="text-sm text-gray-500 mt-3">Formulario: {survey.formulario.titulo}</p>
            <p className="text-sm text-red-500 mt-1">* Pregunta obligatoria</p>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {sortedQuestions.map((question, index) => (
              <div key={question.id} className="px-8 py-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 text-sm font-medium">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-base text-gray-900 font-medium">
                      {question.texto}
                      {question.es_obligatoria && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {question.tipo}
                    </span>
                  </div>
                </div>

                <div className="mt-4 ml-6 space-y-2">
                  {renderQuestionInput(question)}
                  {fieldErrors[question.id] && (
                    <p className="text-sm text-red-600">{fieldErrors[question.id]}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="px-8 py-6 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Envía tus respuestas cuando estés listo.</span>
              </div>
              <button
                type="submit"
                disabled={submitLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                Enviar encuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
